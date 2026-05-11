export interface TxPayloadV1 {
  /**
   * Payload version. MUST be 1.
   */
  version: 1

  /**
   * Signer selection hint. Allows the implementer to identify which private-key
   * / scheme to use.
   * - Use a wallet-defined handle (e.g., address/SS58, account-name, etc). This
   * identifier was previously made available to the consumer.
   * - Set `null` to let the implementer pick the signer (or if the signer is
   * implied).
   */
  signer: string | null

  /**
   * SCALE-encoded Call (module indicator + function indicator + params).
   */
  callData: string

  /**
   * Transaction extensions supplied by the caller (order irrelevant).
   * The consumer SHOULD provide every extension that is relevant to them.
   * The implementer MAY infer missing ones.
   */
  extensions: Array<{
    /**
     * Identifier as defined in metadata (e.g., "CheckSpecVersion",
     * "ChargeAssetTxPayment").
     */
    id: string

    /**
     * Explicit "extra" to sign (goes into the extrinsic body).
     * SCALE-encoded per the extension's "extra" type as defined in the
     * metadata.
     */
    extra: string

    /**
     * "Implicit" data to sign (known by the chain, not included into the
     * extrinsic body).
     * SCALE-encoded per the extension's "additionalSigned" type as defined in
     * the metadata.
     */
    additionalSigned: string
  }>

  /**
   * Transaction Extension Version.
   * - For Extrinsic V4 MUST be 0.
   * - For Extrinsic V5, set to any version supported by the runtime.
   * The implementer:
   * - MUST use this field to determine the required extensions for creating the
   * extrinsic.
   * - MAY use this field to infer missing extensions that the implementer could
   * know how to handle.
   */
  // TODO: this is a change
  txExtVersion: number | null

  /**
   * Context needed for decoding, display, and (optionally) inferring certain
   * extensions.
   */
  context: {
    /**
     * RuntimeMetadataPrefixed blob (SCALE), starting with ASCII "meta" magic
     * (`0x6d657461`),
     * then a metadata version (V14+). For V5+ versioned extensions, MUST
     * provide V16+.
     * It is the metadata at `bestBlockHash`.
     */
    // TODO: this is a change
    metadata: string

    /**
     * Native token display info (used by some implementers), also needed to
     * compute the `CheckMetadataHash` value.
     */
    // TODO: this is a change, making it optional and together
    token: {
      symbol: string
      decimals: number
    } | null

    /**
     * Highest known block number to aid mortality UX.
     */
    bestBlockHeight: number

    /**
     * Highest known block hash.
     */
    // TODO: this is a change
    bestBlockHash: string

    /**
     * Genesis hash.
     */
    // TODO: this is a change
    genesisHash: string
  }
}

/**
 * Creates a SCALE-encoded extrinsic (ready to broadcast).
 */
export type TxCreator<T> = (input: TxPayloadV1, opts: T) => Promise<string>
