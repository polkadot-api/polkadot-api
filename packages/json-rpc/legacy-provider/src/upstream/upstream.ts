import type { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import { createClient } from "@polkadot-api/raw-client"
import { getBlocks$ } from "./blocks"
import { createDescendantValues } from "./descendant-values"
import { endWith, filter, map, merge, Observable, take } from "rxjs"

export const createUpstream = (provider: JsonRpcProvider) => {
  const { request, disconnect: rawDisconnect } = createClient(provider)
  const getBlocks = getBlocks$(request)

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

  const stgDescendantHashes = (_: string, __: string) =>
    new Observable<Array<[string, string]>>((observer) =>
      observer.error("not implemented"),
    )

  const stgClosestDescendant = (_: string, __: string) =>
    new Observable<string | null>((observer) =>
      observer.error("not implemented"),
    )

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

  const genesisHash = merge(
    ...["4def25cfda6ef3a00000000", "b1bdbcacd6ac9340000000000000000"].map(
      (key) =>
        stgValue(
          undefined as unknown as string,
          "0x26aa394eea5630e07c48ae0c9558cef7a44704b568d21667356a5a050c118746b" +
            key,
        ),
    ),
  ).pipe(
    filter(Boolean),
    endWith(null),
    take(1),
    map((x) => {
      if (!x) throw "Could not fetch genensis hash"
      return x
    }),
  )

  const disconnect = () => {
    getBlocks.stop()
    rawDisconnect()
  }

  return {
    getBlocks,
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
    disconnect,
    methods,
    request: simpleRequest,
  }
}
