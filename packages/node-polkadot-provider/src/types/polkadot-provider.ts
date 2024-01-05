export type Callback<T> = (value: T) => void
type UnsubscribeFn = () => void

// `chainId` explanation:
// (hash_of_forked_block, block_number_of_forked_block)
// is the proper way of uniquely identifying a chain.
// Meaning that: for chains that haven't experienced any
// forks, the identifier would be (genesis_hash, 0).
// We represent this information as a hexadecimal string,
// where a non-forked chain will have a 32-byte long
// hexadecimal string representing the genesis hash.
// However, for a forked-chain, its identifier will be
// longer than 32 bytes. This extra length is attributable
// to the compact encoded block number, appended to the
// hash of the forked block.

export interface Chain {
  chainId: string
  name: string
  symbol: string
  decimals: number
  ss58Format: number

  // it pulls the current list of available accounts for this Chain
  getAccounts: () => Promise<Array<Account>>

  // registers a callback that will be invoked whenever the list
  // of available accounts for this chain has changed. The callback
  // will be synchronously called with the current list of accounts.
  onAccountsChange: (accounts: Callback<Array<Account>>) => UnsubscribeFn

  // returns a JSON RPC Provider that it's compliant with new
  // JSON-RPC API spec:
  // https://paritytech.github.io/json-rpc-interface-spec/api.html
  connect: (
    // the listener callback that the JsonRpcProvider
    // will be sending messages to
    onMessage: Callback<string>,
  ) => JsonRpcProvider
}

export interface RelayChain extends Chain {
  getParachain: (chainspec: string) => Promise<Chain>
}

export interface JsonRpcProvider {
  // it sends messages to the JSON RPC Server
  send: (message: string) => void

  // `publicKey` is the SS58Formated public key
  // `callData` is the scale encoded call-data
  // (module index, call index and args)
  createTx: (publicKey: Uint8Array, callData: Uint8Array) => Promise<Uint8Array>

  // it disconnects from the JSON RPC Server and it de-registers
  // the `onMessage` and `onStatusChange` callbacks that
  // were previously registered
  disconnect: UnsubscribeFn
}

export interface Account {
  // SS58 formated public key
  address: string

  // public key of the account
  publicKey: Uint8Array

  // The provider may have captured a display name
  displayName?: string
}
