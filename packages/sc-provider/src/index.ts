import type { ConnectProvider, Provider } from "@polkadot-api/json-rpc-provider"
import { getSyncProvider } from "@polkadot-api/json-rpc-provider-proxy"
import type {
  ScClient,
  Config,
  Chain,
  JsonRpcCallback,
} from "@substrate/connect"
import { WellKnownChain, createScClient } from "@substrate/connect"

export const wellKnownChains: ReadonlySet<string> = new Set<WellKnownChain>(
  Object.values(WellKnownChain),
)

const isWellKnownChain = (input: string): input is WellKnownChain =>
  wellKnownChains.has(input)

const customCreateScClient = (...args: Parameters<typeof createScClient>) => {
  const client = createScClient(...args)

  let pending: Promise<any> | null = null
  const addWellKnownChain = async (
    ...args: Parameters<(typeof client)["addWellKnownChain"]>
  ) => {
    if (pending) await pending
    const result = client.addWellKnownChain(...args)
    pending = result
    return result
  }

  const addChain = async (...args: Parameters<(typeof client)["addChain"]>) => {
    if (pending) await pending
    const result = client.addChain(...args)
    pending = result
    return result
  }

  return { addChain, addWellKnownChain }
}

let client: ScClient
const noop = () => {}

export type ScProviderConfig = Config & {
  relayChainSpec?: string
  client?: ScClient
}

export const ScProvider = (
  input: WellKnownChain | string,
  config?: ScProviderConfig,
) => {
  client ??= config?.client ?? customCreateScClient(config)
  const addChain = (input: string, jsonRpcCallback?: JsonRpcCallback) =>
    isWellKnownChain(input)
      ? client.addWellKnownChain(input, jsonRpcCallback)
      : client.addChain(input, jsonRpcCallback)

  return getSyncProvider(async () => {
    let listener: (message: string) => void = noop
    const onMessage = (msg: string) => {
      listener(msg)
    }

    let chain: Chain
    try {
      const relayChain = config?.relayChainSpec
        ? await addChain(config.relayChainSpec)
        : undefined
      chain = relayChain
        ? await relayChain.addChain(input, onMessage)
        : await addChain(input, onMessage)
    } catch (e) {
      console.warn(
        `couldn't create chain with: ${input} ${config?.relayChainSpec ?? ""}`,
      )
      console.error(e)
      throw e
    }

    return (onMessage) => {
      listener = onMessage
      return {
        send(msg: string) {
          chain.sendJsonRpc(msg)
        },
        disconnect() {
          listener = noop
          chain.remove()
        },
      }
    }
  })
}

export { WellKnownChain }
export type { ConnectProvider, ScClient, Provider }
