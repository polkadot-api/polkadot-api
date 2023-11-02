import { ConnectProvider } from "@polkadot-api/sc-provider"
import { SubstrateClient, createClient } from "@polkadot-api/substrate-client"

const clientRequest =
  (client: SubstrateClient) =>
  <T>(method: string, args: Array<any> = []): Promise<T> =>
    new Promise((res, rej) =>
      client._request(method, args, {
        onSuccess: res,
        onError: rej,
      }),
    )

export const getChainProps = async (provider: ConnectProvider) => {
  const client = createClient(provider)
  const request = clientRequest(client)

  const [chainId, name] = await Promise.all([
    request<string>("chainSpec_v1_genesisHash"),
    request<string>("chainSpec_v1_chainName"),
  ])

  client.destroy()
  return { chainId, name }
}
