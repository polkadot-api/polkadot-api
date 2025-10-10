import { ClientRequest } from "@polkadot-api/raw-client"
import { fromHex, toHex } from "@polkadot-api/utils"
import { map, Observable } from "rxjs"
import { getBlocks$ } from "./blocks"
import { createDescendantValues } from "../../utils"
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

  const innerStgDescendantVals = createDescendantValues(simpleRequest)
  const stgDescendantValues = (at: string, rootKey: string) =>
    new Observable<Array<[string, string]>>((observer) =>
      innerStgDescendantVals(
        rootKey,
        at,
        (values) => {
          observer.next(values)
        },
        (e) => {
          observer.error(e)
        },
        () => {
          observer.complete()
        },
      ),
    )

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
