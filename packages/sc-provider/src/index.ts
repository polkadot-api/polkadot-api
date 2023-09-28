import type {
  GetProvider,
  Provider,
  ProviderStatus,
} from "@polkadot-api/json-rpc-provider"
import type { ScClient, Chain, Config } from "@substrate/connect"
import { WellKnownChain, createScClient } from "@substrate/connect"

export { WellKnownChain }
export type { GetProvider, Provider, ProviderStatus }

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

export const ScProvider = (
  input: WellKnownChain | string,
  config?: Config,
): GetProvider => {
  client ??= customCreateScClient(config)

  return (onMessage, onStatus): Provider => {
    let chain: Chain | null = null
    let pending = false

    const open = () => {
      if (chain || pending) return

      pending = true
      ;(wellKnownChains.has(input as any)
        ? client.addWellKnownChain(input as WellKnownChain, onMessage)
        : client.addChain(input, onMessage)
      )
        .then((_chain) => {
          chain = _chain
          onStatus("connected")
        })
        .catch((e) => {
          console.warn("There was a problem adding the Chain")
          console.error(e)
          onStatus("disconnected")
        })
        .finally(() => {
          pending = false
        })
    }

    const close = () => {
      chain?.remove()
      chain = null
    }

    const send = (msg: string) => {
      chain!.sendJsonRpc(msg)
    }

    return { open, close, send }
  }
}
