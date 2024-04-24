export interface ChainSpecData {
  name: string
  genesisHash: string
  properties: any
}

export const createGetChainSpec = (
  request: <T>(
    method: string,
    params: any[],
    abortSignal?: AbortSignal,
  ) => Promise<T>,
  rpcMethods: Promise<Set<string>> | Set<string>,
) => {
  let cachedPromise: null | Promise<ChainSpecData> = null

  return async (): Promise<ChainSpecData> => {
    if (cachedPromise) return cachedPromise

    const methods: Set<string> =
      rpcMethods instanceof Promise ? await rpcMethods : rpcMethods
    const version = methods.has("chainSpec_v1_chainName") ? "v1" : "unstable"

    return (cachedPromise = Promise.all([
      request<string>(`chainSpec_${version}_chainName`, []),
      request<string>(`chainSpec_${version}_genesisHash`, []),
      request<any>(`chainSpec_${version}_properties`, []),
    ]).then(([name, genesisHash, properties]) => ({
      name,
      genesisHash,
      properties,
    })))
  }
}
