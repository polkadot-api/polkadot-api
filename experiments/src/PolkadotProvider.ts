import { SubstrateClient } from "@polkadot-api/substrate-client"

type Callback<T> = (value: T) => void
type UnsubscribeFn = () => void

interface Account {
  displayName?: string
  publicKey: string
  createTx: (callData: string) => Promise<string>
}

interface ChainProvider {
  getAccounts: () => Account[]
  onAccountsChange: (accounts: Callback<Account[]>) => UnsubscribeFn
  client: SubstrateClient
}

interface Network {
  genesisHash: string
  chainspec: string
  connect: () => Promise<ChainProvider>
}

export interface PolkadotProvider {
  addNetwork: (chainspec: string) => Promise<Network>
  getNetworks: () => Network[]
  onNetworksChange: (networks: Callback<Network[]>) => UnsubscribeFn
}
