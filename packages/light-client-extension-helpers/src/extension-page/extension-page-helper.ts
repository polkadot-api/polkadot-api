import type { LightClientPageHelper } from "./types"
import { storage } from "@/shared"
import {
  BackgroundResponseAddChainData,
  BackgroundResponseDisconnect,
  BackgroundResponseGetActiveConnections,
} from "@/protocol"
import { sendBackgroundRequest } from "@/shared"

export const helper: LightClientPageHelper = {
  async deleteChain(genesisHash) {
    // TODO: check, Should it disconnect any activeChain?
    await Promise.all([
      storage.remove({ type: "chain", genesisHash }),
      storage.remove({ type: "bootNodes", genesisHash }),
      storage.remove({ type: "databaseContent", genesisHash }),
    ])
    for (const {
      genesisHash: parachainGenesisHash,
      relayChainGenesisHash,
    } of Object.values(await storage.getChains())) {
      if (relayChainGenesisHash !== genesisHash) continue
      await Promise.all([
        storage.remove({ type: "chain", genesisHash: parachainGenesisHash }),
        storage.remove({
          type: "bootNodes",
          genesisHash: parachainGenesisHash,
        }),
        storage.remove({
          type: "databaseContent",
          genesisHash: parachainGenesisHash,
        }),
      ])
    }
  },
  async persistChain(chainSpec, relayChainGenesisHash) {
    // TODO: What if the chain already exists? Throw?
    const { type, ...chainData } =
      await sendBackgroundRequest<BackgroundResponseAddChainData>({
        type: "getChainData",
        chainSpec,
        relayChainGenesisHash,
      })
    await storage.set(
      { type: "chain", genesisHash: chainData?.genesisHash },
      { ...chainData, chainSpec, relayChainGenesisHash },
    )
  },
  async getChain(genesisHash) {
    const chain = await storage.get({ type: "chain", genesisHash })
    if (!chain) return

    const bootNodes =
      (await storage.get({ type: "bootNodes", genesisHash })) ??
      (JSON.parse(chain.chainSpec).bootNodes as string[])

    return {
      ...chain,
      bootNodes,
      // FIXME: Implement
      nPeers: -1,
      // FIXME: Implement
      provider: (_onMessage, _onStatus) => {
        throw new Error("Function not implemented.")
        return {
          send: (_message: string) => {},
          open: () => {},
          close: () => {},
        }
      },
    }
  },
  async getActiveConnections() {
    const { connections } =
      await sendBackgroundRequest<BackgroundResponseGetActiveConnections>({
        type: "getActiveConnections",
      })
    return connections
  },
  async disconnect(tabId: number, genesisHash: string) {
    await sendBackgroundRequest<BackgroundResponseDisconnect>({
      type: "disconnect",
      tabId,
      genesisHash,
    })
  },
  setBootNodes(genesisHash, bootNodes) {
    return storage.set({ type: "bootNodes", genesisHash }, bootNodes)
  },
}
