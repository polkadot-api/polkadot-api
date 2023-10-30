import {
  storage,
  sendBackgroundRequest,
  PORT,
  createBackgroundClientConnectProvider,
} from "@/shared"
import type { LightClientPageHelper } from "./types"

// FIXME: re-connect?
const port = chrome.runtime.connect({ name: PORT.EXTENSION_PAGE })

export const helper: LightClientPageHelper = {
  async deleteChain(genesisHash) {
    await sendBackgroundRequest({ type: "deleteChain", genesisHash })
  },
  async persistChain(chainSpec, relayChainGenesisHash) {
    await sendBackgroundRequest({
      type: "persistChain",
      chainSpec,
      relayChainGenesisHash,
    })
  },
  async getChains() {
    return Promise.all(
      Object.entries(await storage.getChains()).map(
        async ([genesisHash, chain]) => ({
          ...chain,
          bootNodes:
            (await storage.get({ type: "bootNodes", genesisHash })) ??
            (JSON.parse(chain.chainSpec).bootNodes as string[]),
          provider: createBackgroundClientConnectProvider({
            genesisHash,
            postMessage(msg) {
              port.postMessage(msg)
            },
            addOnMessageListener(cb) {
              port.onMessage.addListener(cb)
              return () => port.onMessage.removeListener(cb)
            },
            addOnDisconnectListener(cb) {
              port.onDisconnect.addListener(cb)
              return () => port.onDisconnect.removeListener(cb)
            },
          }),
        }),
      ),
    )
  },
  async getActiveConnections() {
    const { connections } = await sendBackgroundRequest({
      type: "getActiveConnections",
    })
    return connections
  },
  async disconnect(tabId: number, genesisHash: string) {
    await sendBackgroundRequest({
      type: "disconnect",
      tabId,
      genesisHash,
    })
  },
  async setBootNodes(genesisHash, bootNodes) {
    await sendBackgroundRequest({
      type: "setBootNodes",
      genesisHash,
      bootNodes,
    })
  },
}
