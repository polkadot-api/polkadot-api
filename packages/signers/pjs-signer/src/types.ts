type HexString = string
export interface SignerPayloadJSON {
  /**
   * The ss-58 encoded address.
   */
  address: string

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
   * The encoded method (with arguments) in hex.
   */
  method: string

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
}
