import { getTrackingId, logResponse } from "../internal"
import { Observable, Subject, Subscription } from "rxjs"
import type { Codec, StringRecord } from "solidity-codecs"
import type { EventFilter, SolidityEvent } from "../descriptors"
import type { Untuple } from "../utils"

const toHex = (block: number): string => "0x" + block.toString(16)

export const getPullingEvent = (
  currentBlockNumber$: Observable<{ chainId: string; blockNumber: number }>,
  request: <T = any>(
    method: string,
    args: Array<any>,
    meta?: any,
  ) => Promise<T>,
  logger?: (msg: any) => void,
) => {
  const eventsProcessor$ = new Subject<{
    chainId: string
    blockNumber: number
    type: "pre" | "post"
  }>()
  const listeners = new Map<
    number,
    {
      getLogs: (blockNumer: number) => Promise<any>
      onNext: (value: any, blockNumer: number) => void
      onError: (e: any, blockNumer: number) => void
      onComplete: () => void
    }
  >()

  let subscription: Subscription | null = null
  let isWaiting = false
  let latestBlock = 0
  let currentChainId = ""
  const pull = (currentBlock: number, chainId: string) => {
    isWaiting = true
    eventsProcessor$.next({ chainId, blockNumber: currentBlock, type: "pre" })
    Promise.all(
      [...listeners].map(([key, { getLogs }]) => {
        return getLogs(currentBlock).then(
          (payload) => ({ ok: true, key, payload }),
          (payload) => ({ ok: false, key, payload }),
        )
      }),
    ).then((results) => {
      if (chainId !== currentChainId) return

      results.forEach(({ ok, key, payload }) => {
        if (!listeners.has(key)) return
        const { onNext, onError } = listeners.get(key)!
        ;(ok ? onNext : onError)(payload, currentBlock)
      })
      eventsProcessor$.next({
        chainId,
        blockNumber: currentBlock,
        type: "post",
      })
      isWaiting = false
      if (latestBlock !== currentBlock) pull(latestBlock, chainId)
    })
  }

  const resetStates = () => {
    subscription = null
    isWaiting = false
    latestBlock = 0
    currentChainId = ""
  }

  const start = () => {
    if (subscription) return
    subscription = currentBlockNumber$.subscribe({
      next({ blockNumber: currentBlock, chainId }) {
        latestBlock = currentBlock
        currentChainId = chainId
        if (!isWaiting) pull(currentBlock, chainId)
      },
      complete() {
        resetStates()
        ;[...listeners.values()].forEach(({ onComplete }) => {
          onComplete()
        })
      },
      error(e) {
        resetStates()
        ;[...listeners.values()].forEach(({ onError }) => {
          onError(e, latestBlock)
        })
      },
    })
  }

  const addListener = (
    id: number,
    getLogs: (blockNumer: number) => Promise<any>,
    onNext: (value: any, blockNumer: number) => void,
    onError: (e: any, blockNumer: number) => void,
    onComplete: () => void,
  ) => {
    listeners.set(id, { getLogs, onNext, onError, onComplete })
    start()
    return () => {
      listeners.delete(id)
      if (listeners.size === 0) {
        subscription?.unsubscribe()
        subscription = null
      }
    }
  }

  const queryEvent =
    <F extends StringRecord<Codec<any>>, O>(e: SolidityEvent<F, O, any>) =>
    async (
      eventFilter: Partial<EventFilter<F>>,
      from: number | "latest" | "pending" | "earliest",
      to: number | "latest" | "pending" | "earliest",
      contractAddress?: string,
    ) => {
      const options: { topics: (string | null)[]; address?: string } = {
        topics: e.encodeTopics(eventFilter),
      }
      if (contractAddress) options.address = contractAddress
      const results = await request<Array<any>>("eth_getLogs", [
        {
          ...options,
          fromBlock: typeof from === "string" ? from : toHex(from),
          toBlock: typeof to === "string" ? to : toHex(to),
        },
      ])

      return results.map((message: any) => {
        return {
          data: e.decodeData(message.data),
          filters: e.decodeFilters(message.topics),
          message,
        }
      })
    }

  const event =
    <F extends StringRecord<Codec<any>>, O>(e: SolidityEvent<F, O, any>) =>
    (
      eventFilter: Partial<EventFilter<F>>,
      contractAddress?: string,
      startAtBlock?: number,
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
        let fromBlock = startAtBlock ?? 0
        return addListener(
          subscriptionId,
          (currentBlockNumber) =>
            requestEvent(
              fromBlock > 0 && fromBlock < currentBlockNumber
                ? fromBlock
                : currentBlockNumber,
              currentBlockNumber,
            ),
          (x, processedBlockNumber) => {
            fromBlock = processedBlockNumber + 1
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
          () => {
            observer.complete()
          },
        )
      })
    }

  return { event, eventsProcessor$, queryEvent }
}
