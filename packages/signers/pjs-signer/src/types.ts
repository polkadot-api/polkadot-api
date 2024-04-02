type HexString = string
export interface SignerPayloadJSON {
  /**
   * @description The ss-58 encoded address
   */
  address: string

  /**
   * @description The checkpoint hash of the block, in hex
   */
  blockHash: HexString

  /**
   * @description The era for this transaction, in hex
   */
  era: HexString

  /**
   * @description The genesis hash of the chain, in hex
   */
  genesisHash: HexString

  blockNumber: number | bigint

  /**
   * @description The encoded method (with arguments) in hex
   */
  method: string

  /**
   * @description The nonce for this transaction, in hex
   */
  nonce: number | bigint

  /**
   * @description The current spec version for the runtime
   */
  specVersion: HexString

  /**
   * @description The tip for this transaction, in hex
   */
  tip: HexString

  /**
   * @description The current transaction version for the runtime
   */
  transactionVersion: HexString

  /**
   * @description The applicable signed extensions for this runtime
   */
  signedExtensions: string[]

  /**
   * @description The version of the extrinsic we are dealing with
   */
  version: number
}
