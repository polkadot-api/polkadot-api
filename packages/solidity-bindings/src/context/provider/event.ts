import { Decoder, StringRecord } from "solidity-codecs"
import { Observable } from "rxjs"

export const getEvent =
  (subscribe: <T = any>(args: Array<any>) => Observable<T>) =>
  <F extends StringRecord<any>, O>(e: {
    encodeTopics: (filter: Partial<F>) => Array<string | null>
    decodeData: Decoder<O>
    decodeFilters: (topics: Array<string>) => F
    name?: string
  }) =>
  (
    eventFilter: Partial<F>,
    contractAddress?: string,
  ): Observable<{ data: O; filters: F; message: any }> => {
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
