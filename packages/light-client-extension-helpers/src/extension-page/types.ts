import type { ConnectProvider } from "@polkadot-api/json-rpc-provider"

export interface LightClientPageHelper {
  deleteChain: (genesisHash: string) => Promise<void>
  persistChain: (chainspec: string) => Promise<void>
  getChain: (genesisHash: string) => Promise<PageChain>
  getActiveConnections: () => Promise<
    Array<{ tabId: number; genesisHash: string }>
  >
  disconnect: (tabId: number, genesisHash: string) => Promise<void>
  setBootNodes: (genesisHash: string, bootNodes: Array<string>) => Promise<void>
}

export interface PageChain {
  genesisHash: string
  name: string
  ss58format: number
  nPeers: number
  bootNodes: Array<string>
  provider: ConnectProvider
}
