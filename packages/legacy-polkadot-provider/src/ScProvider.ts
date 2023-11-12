import type { ConnectProvider, Provider } from "@polkadot-api/json-rpc-provider"
import type { ScClient, Chain } from "@substrate/connect"
import { getSyncProvider } from "@polkadot-api/json-rpc-provider-proxy"

export enum WellKnownChain {
  polkadot = "polkadot",
  ksmcc3 = "ksmcc3",
  rococo_v2_2 = "rococo_v2_2",
  westend2 = "westend2",
}

export type { ConnectProvider, Provider }

export const wellKnownChains = new Set(Object.values(WellKnownChain))

const getCustomClient = (client: ScClient) => {
  let pending: Promise<any> | null = null
  const addWellKnownChain = async (
    ...args: Parameters<(typeof client)["addWellKnownChain"]>
  ) => {
    if (pending) await pending
    return (pending = client.addWellKnownChain(...args))
  }

  const addChain = async (...args: Parameters<(typeof client)["addChain"]>) => {
    if (pending) await pending
    return (pending = client.addChain(...args))
  }

  return { addChain, addWellKnownChain }
}

const noop = () => {}

export const getScProvider = (baseClient: ScClient) => {
  const client = getCustomClient(baseClient)

  return (input: WellKnownChain | string): ConnectProvider =>
    getSyncProvider(async () => {
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
