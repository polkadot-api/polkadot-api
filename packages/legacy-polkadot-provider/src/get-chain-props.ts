import {
  ConnectProvider,
  SubstrateClient,
  createClient,
} from "@polkadot-api/substrate-client"

const clientRequest =
  (client: SubstrateClient) =>
  <T>(method: string, args: Array<any> = []): Promise<T> =>
    new Promise((res, rej) =>
      client._request(method, args, {
        onSuccess: res,
        onError: rej,
      }),
    )

export const getChainProps = async (
  chain: string,
  getProvider: (chain: string) => ConnectProvider,
) => {
  const client = createClient(getProvider(chain))
  const request = clientRequest(client)

  const [
    { ss58Format, tokenDecimals: decimals, tokenSymbol: symbol },
    chainId,
    name,
  ] = await Promise.all([
    request<{ ss58Format: number; tokenDecimals: number; tokenSymbol: string }>(
      "chainSpec_v1_properties",
    ),
    request<string>("chainSpec_v1_genesisHash"),
    request<string>("chainSpec_v1_chainName"),
  ])

  client.destroy()
  return { ss58Format, chainId, name, chain, decimals, symbol }
}
