import type { ConnectProvider, Provider } from "@polkadot-api/json-rpc-provider"
import { getSyncProvider } from "@polkadot-api/json-rpc-provider-proxy"
import type { ScClient, Config, Chain } from "@substrate/connect"
import { WellKnownChain, createScClient } from "@substrate/connect"

export { WellKnownChain }
export type { ConnectProvider, Provider }

export const wellKnownChains = new Set(Object.values(WellKnownChain))

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

export const ScProvider = (
  input: WellKnownChain | string,
  config?: Config,
): ConnectProvider => {
  client ??= customCreateScClient(config)
  return getSyncProvider(async () => {
    let listener: (message: string) => void = noop
    const onMessage = (msg: string) => {
      listener(msg)
    }

    let chain: Chain

    try {
      chain = await (wellKnownChains.has(input as any)
        ? client.addWellKnownChain(input as WellKnownChain, onMessage)
        : client.addChain(input, onMessage))
    } catch (e) {
      console.warn(`couldn't create chain with: ${input}`)
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
