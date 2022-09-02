import { getTrackingId, logResponse } from "../internal"
import { Observable, Subject, Subscription } from "rxjs"
import type { Codec, StringRecord } from "solidity-codecs"
import type { EventFilter, SolidityEvent } from "../descriptors"
import type { Untuple } from "../utils"

const toHex = (block: number): string => "0x" + block.toString(16)

export const getPullingEvent = (
  currentBlockNumber$: Observable<number>,
  request: <T = any>(
    method: string,
    args: Array<any>,
    meta?: any,
  ) => Promise<T>,
  logger?: (msg: any) => void,
) => {
  const eventsProcessed$ = new Subject<number>()
  const listeners = new Map<
    number,
    {
      getLogs: (blockNumer: number) => Promise<any>
      onNext: (value: any, blockNumer: number) => void
      onError: (e: any, blockNumer: number) => void
    }
  >()

  let subscription: Subscription | null = null
  let isWaiting = false
  let latestBlock = 0
  const pull = (currentBlock: number) => {
    isWaiting = true
    Promise.all(
      [...listeners].map(([key, { getLogs }]) => {
        return getLogs(currentBlock).then(
          (payload) => ({ ok: true, key, payload }),
          (payload) => ({ ok: false, key, payload }),
        )
      }),
    ).then((results) => {
      results.forEach(({ ok, key, payload }) => {
        if (!listeners.has(key)) return
        const { onNext, onError } = listeners.get(key)!
        ;(ok ? onNext : onError)(payload, currentBlock)
      })
      eventsProcessed$.next(currentBlock)
      isWaiting = false
      if (latestBlock !== currentBlock) pull(latestBlock)
    })
  }

  const start = () => {
    if (subscription) return
    subscription = currentBlockNumber$.subscribe((currentBlock) => {
      latestBlock = currentBlock
      if (!isWaiting) pull(currentBlock)
    })
  }

  const addListener = (
    id: number,
    getLogs: (blockNumer: number) => Promise<any>,
    onNext: (value: any, blockNumer: number) => void,
    onError: (e: any, blockNumer: number) => void,
  ) => {
    listeners.set(id, { getLogs, onNext, onError })
    start()
    return () => {
      listeners.delete(id)
      if (listeners.size === 0) {
        subscription?.unsubscribe()
        subscription = null
      }
    }
  }

  const event =
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
      const type = `event_${e.name}`
      const subscriptionId = getTrackingId()
      const requestEvent = (fromBlock: number, toBlock: number) => {
        const trackingId = getTrackingId()
        const meta: any = logger && {
          type,
          subscriptionId,
          trackingId,
          filters: eventFilter,
        }
        return request<Array<any>>(
          "eth_getLogs",
          [
            {
              ...options,
              fromBlock: toHex(fromBlock),
              toBlock: toHex(toBlock),
            },
          ],
          meta,
        ).then(...logResponse(meta, logger))
      }

      return new Observable((observer) => {
        let nextBlockToRequest = 0
        return addListener(
          subscriptionId,
          (currentBlockNumber) =>
            requestEvent(
              nextBlockToRequest || currentBlockNumber,
              currentBlockNumber,
            ),
          (x, processedBlockNumber) => {
            nextBlockToRequest = processedBlockNumber + 1
            if (observer.closed) return
            x.forEach((message: any) => {
              let msg
              try {
                msg = {
                  data: e.decodeData(message.data),
                  filters: e.decodeFilters(message.topics),
                  message,
                }
                observer.next(msg)
              } catch (e) {
                observer.error(e)
              }
            })
          },
          (e) => {
            observer.error(e)
          },
        )
      })
    }

  return { event, eventsProcessed$ }
}
