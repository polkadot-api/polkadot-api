import { ConnectProvider } from "@polkadot-api/json-rpc-provider"

export type BackgroundHelper = (
  // A callback invoked when a dApp developer tries to add a new Chain.
  // The returned promise either rejects if the user denies or resolves if the user agrees.
  onAddChainByUser: (input: InputChain, tabId: number) => Promise<void>,
) => void

export interface InputChain {
  genesisHash: string
  name: string
  chainSpec: string
  relayChainGenesisHash?: string
}

export interface LightClientPageHelper {
  deleteChain: (genesisHash: string) => Promise<void>
  persistChain: (
    chainSpec: string,
    relayChainGenesisHash?: string,
  ) => Promise<void>
  getChains: () => Promise<Array<PageChain>>
  getActiveConnections: () => Promise<
    Array<{ tabId: number; genesisHash: string }>
  >
  disconnect: (tabId: number, genesisHash: string) => Promise<void>
  setBootNodes: (genesisHash: string, bootNodes: Array<string>) => Promise<void>
}

export interface PageChain {
  genesisHash: string
  name: string
  ss58Format: number
  bootNodes: Array<string>
  provider: ConnectProvider
}
