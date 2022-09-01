import { Observable } from "rxjs"
import type { Codec, StringRecord } from "solidity-codecs"
import type { EventFilter, SolidityEvent } from "../descriptors"
import type { Untuple } from "../utils"

const toHex = (block: number): string => "0x" + block.toString(16)

export const getPullingEvent =
  (
    currentBlockNumber$: Observable<number>,
    request: <T = any>(method: string, args: Array<any>) => Promise<T>,
  ) =>
  <F extends StringRecord<Codec<any>>, O>(e: SolidityEvent<F, O, any>) =>
  (
    eventFilter: Partial<EventFilter<F>>,
    contractAddress?: string,
  ): Observable<{
    data: Untuple<O>
    filters: EventFilter<F>
    message: any
  }> => {
    const options: { topics: (string | null)[]; address?: string } = {
      topics: e.encodeTopics(eventFilter),
    }
    if (contractAddress) options.address = contractAddress
    const requestEvent = (fromBlock: number, toBlock: number) =>
      request<Array<any>>("eth_getLogs", [
        { ...options, fromBlock: toHex(fromBlock), toBlock: toHex(toBlock) },
      ])

    return new Observable((observer) => {
      let nextBlockToRequest = 0
      let missed = 0
      let isOngoing = false

      const pullEvents = (untilBlock: number) => {
        missed = 0
        isOngoing = true
        requestEvent(nextBlockToRequest || untilBlock, untilBlock).then((x) => {
          nextBlockToRequest = untilBlock + 1
          if (observer.closed) return
          x.forEach((message) => {
            let msg
            try {
              msg = {
                data: e.decodeData(message.data),
                filters: e.decodeFilters(message.topics),
                message,
              }
            } catch (e) {
              return observer.error(e)
            }
            observer.next(msg)
          })
          isOngoing = false
          if (missed) pullEvents(missed)
        })
      }

      return currentBlockNumber$.subscribe((current) => {
        if (isOngoing) missed = current
        else pullEvents(current)
      })
    })
  }
