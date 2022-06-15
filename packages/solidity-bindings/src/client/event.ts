import { Observable } from "rxjs"
import type { Codec, StringRecord } from "solidity-codecs"
import type { EventFilter, SolidityEvent } from "../descriptors"
import type { Untuple } from "../utils"

export const getEvent =
  (subscribe: <T = any>(args: Array<any>) => Observable<T>) =>
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
    const src = subscribe(["logs", options])
    return new Observable((observer) =>
      src.subscribe({
        next: (x) => {
          let msg
          try {
            msg = {
              data: e.decodeData(x.result.data),
              filters: e.decodeFilters(x.result.topics),
              message: x,
            }
          } catch (e) {
            return observer.error(e)
          }
          observer.next(msg)
        },
        error: (e) => {
          observer.error(e)
        },
        complete: () => {
          observer.complete()
        },
      }),
    )
  }
