import type { LightClientPageHelper } from "./types"
import { storage, sendBackgroundRequest } from "@/shared"

export const helper: LightClientPageHelper = {
  async deleteChain(genesisHash) {
    // TODO: check, Should it disconnect any activeChain?
    // TODO: batch storage.remove
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
    const { type, ...chainData } = await sendBackgroundRequest({
      type: "getChainData",
      chainSpec,
      relayChainGenesisHash,
    })
    await storage.set(
      { type: "chain", genesisHash: chainData?.genesisHash },
      { ...chainData, chainSpec, relayChainGenesisHash },
    )
  },
  async getChains() {
    return Promise.all(
      Object.entries(await storage.getChains()).map(
        async ([genesisHash, chain]) => ({
          ...chain,
          bootNodes:
            (await storage.get({ type: "bootNodes", genesisHash })) ??
            (JSON.parse(chain.chainSpec).bootNodes as string[]),
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
  setBootNodes(genesisHash, bootNodes) {
    return storage.set({ type: "bootNodes", genesisHash }, bootNodes)
  },
}
