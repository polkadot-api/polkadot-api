import { ClientRequest } from "@polkadot-api/raw-client"
import { fromHex, toHex } from "@polkadot-api/utils"
import { catchError, EMPTY, map, merge, mergeMap, Observable, of } from "rxjs"
import { getBlocks$ } from "./blocks"
import { withLatestFromBp } from "../utils/with-latest-from-bp"
import { createClosestDescendantMerkleValue } from "./proofs"

export const createUpstream = (request: ClientRequest<any, any>) => {
  const simpleRequest = <Args extends Array<any>, Payload>(
    method: string,
    params: Args,
    onSuccess: (value: Payload) => void,
    onError: (e: any) => void,
  ): (() => void) => request(method, params, { onSuccess, onError })

  const obsRequest = <Args extends Array<any>, Payload>(
    method: string,
    params: Args,
  ): Observable<Payload> =>
    new Observable((observer) =>
      simpleRequest<Args, Payload>(
        method,
        params,
        (v) => {
          observer.next(v)
          observer.complete()
        },
        (e) => {
          observer.error(e)
        },
      ),
    )

  const {
    upstream: getBlocks,
    finalized$,
    getHeader$,
    hasher$,
    clean,
  } = getBlocks$(request, obsRequest)

  const runtimeCall = (atBlock: string, method: string, data: string) =>
    obsRequest<[string, string, string], string | null>("state_call", [
      method,
      data,
      atBlock,
    ])

  const stgDescendantValues = (
    at: string,
    rootKey: string,
  ): Observable<Array<[string, string]>> => {
    const PAGE_SIZE = 1000
    const getKeys = (startAtKey?: string): Observable<string[]> => {
      return obsRequest<[string, number, string | undefined, string], string[]>(
        "state_getKeysPaged",
        [rootKey, PAGE_SIZE, startAtKey || undefined, at],
      ).pipe(
        mergeMap((receivedKeys) => {
          const keys =
            receivedKeys[0] === startAtKey
              ? receivedKeys.slice(1)
              : receivedKeys

          const continuation =
            receivedKeys.length < PAGE_SIZE
              ? EMPTY
              : getKeys(receivedKeys.at(-1))

          return merge(of(keys), continuation)
        }),
      )
    }

    const getValues = (
      keys: string[],
      nSplits = 0,
    ): Observable<Array<[string, string]>> =>
      keys.length
        ? obsRequest<
            [string[], string],
            [{ block: string; changes: Array<[string, string]> }]
          >("state_queryStorageAt", [keys, at]).pipe(
            map(([{ changes }]) => changes),
            catchError((e: any) => {
              if (nSplits > 3) throw e

              const midIdx = Math.floor(keys.length / 2)
              return merge(
                getValues(keys.slice(0, midIdx), ++nSplits),
                getValues(keys.slice(midIdx), nSplits),
              )
            }),
          )
        : EMPTY

    return getKeys().pipe(mergeMap((keys) => getValues(keys)))
  }

  const stgDescendantHashes = (at: string, rootKey: string) =>
    stgDescendantValues(at, rootKey).pipe(
      withLatestFromBp(hasher$),
      map(([hasher, results]) =>
        results.map(
          ([key, value]) =>
            [key, toHex(hasher(fromHex(value)))] as [string, string],
        ),
      ),
    )

  const stgClosestDescendant = createClosestDescendantMerkleValue(obsRequest)

  const [stgValue, stgHash] = ["state_getStorage", "state_getStorageHash"].map(
    (method) => (atBlock: string, key: string) =>
      obsRequest<[string, string | undefined], string | null>(method, [
        key,
        atBlock,
      ]),
  )

  const methods = obsRequest<[], { methods: string[] }>("rpc_methods", [])
  const chainName = obsRequest<[], string>("system_name", [])
  const properties = obsRequest<[], {}>("system_properties", [])
  const getBody = (at: string) =>
    obsRequest<[string], { block: { extrinsics: Array<string> } }>(
      "chain_getBlock",
      [at],
    )

  const getBlockHash$ = (height: number) =>
    obsRequest<[height: number], string>("chain_getBlockHash", [height])
  const genesisHash = getBlockHash$(0)

  return {
    getBlocks,
    finalized$,
    getBlockHash$,
    getHeader$,
    stgValue,
    stgHash,
    stgDescendantValues,
    stgDescendantHashes,
    stgClosestDescendant,
    runtimeCall,
    getBody,
    chainName,
    properties,
    genesisHash,
    clean,
    methods,
    request: simpleRequest,
    obsRequest,
  }
}
