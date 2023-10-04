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
