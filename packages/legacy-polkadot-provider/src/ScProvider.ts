import type { ConnectProvider, Provider } from "@polkadot-api/json-rpc-provider"
import { type ScClient, type Chain } from "@substrate/connect"
import { getSyncProvider } from "@polkadot-api/json-rpc-provider-proxy"

export enum WellKnownChain {
  polkadot = "polkadot",
  ksmcc3 = "ksmcc3",
  rococo_v2_2 = "rococo_v2_2",
  westend2 = "westend2",
}

export type { ConnectProvider, Provider }

export const wellKnownChains = new Set(Object.values(WellKnownChain))

const noop = () => {}

type AddChain = (input: WellKnownChain | string) => {
  provider: ConnectProvider
  addParachain: (input: string) => ConnectProvider
}

const getProvider = (
  getAddChain: (onMessage: (msg: string) => void) => Promise<Chain>,
  input: string,
) =>
  getSyncProvider(async () => {
    let listener: (message: string) => void = noop
    const onMessage = (msg: string) => {
      listener(msg)
    }
    let chain: Chain
    try {
      chain = await getAddChain(onMessage)
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
          chain?.remove()
        },
      }
    }
  })

export const getScProvider = (client: ScClient): AddChain => {
  return (input: WellKnownChain | string) => {
    const getRelayChain = (onMessage?: (data: string) => void) =>
      wellKnownChains.has(input as any)
        ? client.addWellKnownChain(input as WellKnownChain, onMessage)
        : client.addChain(input, onMessage)

    const provider = getProvider(getRelayChain, input)

    const addParachain = (input: string) =>
      getProvider(async (onMessage) => {
        const relayChain = await getRelayChain()
        const chain = await relayChain.addChain(input, onMessage)
        const originalRemove = chain.remove.bind(chain)
        chain.remove = () => {
          originalRemove()
          relayChain.remove
        }
        return chain
      }, input)

    return { provider, addParachain }
  }
}
