import type { Client } from "@unstoppablejs/client"
import { mergeUint8, toHex, utf16StrToUtf8Bytes } from "@unstoppablejs/utils"
import { Observable } from "rxjs"
import { twoX128 } from "./twoX128"

export const storageKeys = (pallet: string) => {
  const palledEncoded = twoX128(utf16StrToUtf8Bytes(pallet))
  return <
    A extends ((x: any) => Uint8Array)[],
    OT extends {
      [K in keyof A]: A[K] extends (x: infer V) => any ? V : unknown
    },
  >(
    item: string,
    ...valueKeys: [...A]
  ) => {
    const palletItemEncoded = mergeUint8(
      palledEncoded,
      twoX128(utf16StrToUtf8Bytes(item)),
    )

    return (...args: OT): string =>
      toHex(
        mergeUint8(
          palletItemEncoded,
          ...args.map((val, idx) => valueKeys[idx](val)),
        ),
      )
  }
}

export const storageClient = (
  client: Client,
  batchMaxSize = 500,
  batchMaxTime = 50,
) => {
  const queryStorageAt = (keys: string[]) =>
    client.requestReply<[{ changes: Array<[string, string]> }]>(
      "state_queryStorageAt",
      [keys],
    )

  const currentBatch: Map<
    string,
    Array<{
      mapper: (x: string) => any
      res: (x: string | null) => void
      rej: (e: any) => void
    }>
  > = new Map()

  const flush = () => {
    const waiters = new Map([...currentBatch.entries()])
    currentBatch.clear()

    queryStorageAt([...waiters.keys()])
      .then((value) => {
        value[0].changes.forEach(([key, val]) => {
          waiters.get(key)!.forEach(({ res, mapper }) => {
            res(val !== null ? mapper(val) : val)
          })
        })
      })
      .catch((e) => {
        ;[...waiters.values()].forEach((c) => c.forEach((cc) => cc.rej(e)))
      })
  }

  let token = 0
  const tick = () => {
    clearTimeout(token)
    if (currentBatch.size >= batchMaxSize) {
      flush()
    } else {
      token = setTimeout(flush, batchMaxTime) as any
    }
  }

  const getFromStorage = <T>(
    key: string,
    mapper: (value: string) => T,
  ): Promise<T | null> => {
    const result = new Promise<T | null>((res, rej) => {
      const entry = { res: res as any, rej, mapper }
      if (currentBatch.has(key)) {
        currentBatch.get(key)!.push(entry)
      } else {
        currentBatch.set(key, [entry])
      }
    })
    tick()
    return result
  }

  const getKeysPaged = (from: string, to: string, limit: number) => {
    return client.requestReply<string[]>("state_getKeysPaged", [
      from,
      limit,
      to,
    ])
  }

  const getKeys = (
    rootKey: string,
    limit: number = 400,
  ): Observable<string[]> => {
    return new Observable((observer) => {
      const pull = (lastOne: string) =>
        getKeysPaged(rootKey, lastOne, limit).then(
          (x) => {
            if (observer.closed) return
            observer.next(x)
            if (x.length >= limit) pull(x[x.length - 1])
            else observer.complete()
          },
          (e) => {
            if (observer.closed) return
            observer.error(e)
          },
        )

      pull(rootKey)
    })
  }

  return { getFromStorage, getKeys }
}
