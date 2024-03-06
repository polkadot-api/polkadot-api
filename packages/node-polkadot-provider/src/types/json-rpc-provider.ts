export type Callback<T> = (value: T) => void
type UnsubscribeFn = () => void

export type HintedSignedExtensions = Partial<{
  tip: bigint
  mortality: { mortal: false } | { mortal: true; period: number }
  assetId: Uint8Array
}>

export interface JsonRpcProvider {
  // it sends messages to the JSON RPC Server
  send: (message: string) => void

  // `publicKey` is the SS58Formated public key
  // `callData` is the scale encoded call-data
  // (module index, call index and args)
  createTx: (
    publicKey: Uint8Array,
    callData: Uint8Array,
    hintedSignedExtensions?: HintedSignedExtensions,
  ) => Promise<Uint8Array>

  // it disconnects from the JSON RPC Server and it de-registers
  // the `onMessage` and `onStatusChange` callbacks that
  // were previously registered
  disconnect: UnsubscribeFn
}

export type Connect = (onMessage: (value: string) => void) => JsonRpcProvider
