type Callback<T> = (value: T) => void
type UnsubscribeFn = () => void

// The key is the genesis-hash of the chain
type Chains = Record<string, Chain>

export interface Chain {
  genesisHash: string
  name: string

  // it pulls the current list of available accounts for this Chain
  getAccounts: () => Array<Account>

  // registers a callback that will be invoked whenever the list
  // of available accounts for this chain has changed
  onAccountsChange: (accounts: Callback<Array<Account>>) => UnsubscribeFn

  // returns a JSON RPC Provider that it's compliant with new
  // JSON-RPC API spec:
  // https://paritytech.github.io/json-rpc-interface-spec/api.html
  connect: (
    // the listener callback that the JsonRpcProvider
    // will be sending messages to
    onMessage: Callback<string>,

    // the listener that will be notified when the connectivity changes
    onStatusChange: Callback<ProviderStatus>,
  ) => Promise<JsonRpcProvider>
}

type ProviderStatus = "connected" | "disconnected"

export interface JsonRpcProvider {
  // it sends messages to the JSON RPC Server
  send: (message: string) => void

  // `publicKey` is the SS58Formated public key
  // `callData` is the scale encoded call-data
  // (module index, call index and args)
  createTx: (publicKey: string, callData: Uint8Array) => Promise<Uint8Array>

  // it disconnects from the JSON RPC Server and it de-registers
  // the `onMessage` and `onStatusChange` callbacks that
  // were previously registered
  disconnect: UnsubscribeFn
}

export interface Account {
  // SS58Formated public key
  publicKey: string

  // The provider may have captured a display name
  displayName?: string
}

export interface PolkadotProvider {
  // Retrieves the current list of available Chains
  // that the dApp can connect to
  getChains: () => Chains

  // Registers a callback invoked when the list
  // of available chains changes
  onChainsChange: (chains: Callback<Chains>) => UnsubscribeFn

  // Allows the dApp to request the Provider to register a Chain
  addChain: (chainspec: string) => Promise<Chain>
}
