import { ClientRequest } from "./client"
import { abortablePromiseFn } from "./internal-utils"
import { chainSpec } from "./methods"

export interface ChainSpecData {
  name: string
  genesisHash: string
  properties: any
}

export const createGetChainSpec = (clientRequest: ClientRequest<any, any>) => {
  const request = abortablePromiseFn(
    <T>(
      onSuccess: (value: T) => void,
      onError: (e: any) => void,
      method: string,
      params: any[],
    ) => clientRequest(method, params, { onSuccess, onError }),
  )
  let cachedPromise: null | Promise<ChainSpecData> = null

  return async (): Promise<ChainSpecData> => {
    if (cachedPromise) return cachedPromise
    return (cachedPromise = Promise.all([
      request<string>(chainSpec.chainName, []),
      request<string>(chainSpec.genesisHash, []),
      request<any>(chainSpec.properties, []),
    ]).then(([name, genesisHash, properties]) => ({
      name,
      genesisHash,
      properties,
    })))
  }
}
