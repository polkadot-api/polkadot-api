type HexString = `0x${string}`
export interface SignerPayloadJSON {
  /**
   * The ss-58 encoded address.
   */
  address: string
  /**
   * The id of the asset used to pay fees, in hex.
   */
  assetId?: number | object
  /**
   * The checkpoint hash of the block, in hex.
   */
  blockHash: HexString
  /**
   * The checkpoint block number, in hex.
   */
  blockNumber: HexString
  /**
   * The era for this transaction, in hex.
   */
  era: HexString
  /**
   * The genesis hash of the chain, in hex.
   */
  genesisHash: HexString
  /**
   * The metadataHash for the CheckMetadataHash SignedExtension, as hex.
   */
  metadataHash?: HexString
  /**
   * The encoded method (with arguments) in hex.
   */
  method: string
  /**
   * The mode for the CheckMetadataHash SignedExtension, in hex.
   */
  mode?: number
  /**
   * The nonce for this transaction, in hex.
   */
  nonce: HexString
  /**
   * The current spec version for the runtime.
   */
  specVersion: HexString
  /**
   * The tip for this transaction, in hex.
   */
  tip: HexString
  /**
   * The current transaction version for the runtime.
   */
  transactionVersion: HexString
  /**
   * The applicable signed extensions for this runtime.
   */
  signedExtensions: string[]
  /**
   * The version of the extrinsic we are dealing with.
   */
  version: number
  /**
   * Optional flag that enables the use of the `signedTransaction` field in
   * `singAndSend`, `signAsync`, and `dryRun`.
   */
  withSignedTransaction?: boolean
}

export type Mortality =
  | { mortal: false; genesisHash: HexString }
  | {
      mortal: true
      period: number
      phase: number
      blockHash: HexString
    }

export type TxData = {
  callData: Uint8Array
  asset: Uint8Array | undefined
  metadataHash: Uint8Array | null
  tip: bigint
  mortality: Mortality
  genesisHash: HexString
  nonce: number
}
