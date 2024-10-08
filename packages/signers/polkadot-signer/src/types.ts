export interface PolkadotSigner {
  publicKey: Uint8Array
  /**
   * Signs a transaction (extrinsic) for broadcasting.
   *
   * @param callData          The call data of the transaction (without the
   *                          compact length prefix).
   * @param signedExtensions  Extensions that should be signed along with the
   *                          extrinsic.
   *                          The record's `key` represents the identifier,
   *                          which is included both as the `key` and within
   *                          the value for convenience. The `value`
   *                          represents the `extra` portion, which is
   *                          included in the extrinsic itself, while
   *                          `additionalSigned` is the part that is signed
   *                          but not included in the extrinsic.
   * @param metadata          The metadata in SCALE-encoded format. This can
   *                          either be in `Opaque` form or just the raw
   *                          metadata, starting with the appropriate
   *                          metadata magic number and metadata version.
   * @param atBlockNumber     The block number at which the transaction has
   *                          been created.
   * @param hasher            An optional hashing function to build the
   *                          extrinsic with. Defaults to `Blake2b` with a
   *                          256-bit hash length.
   * @returns A signed extrinsic ready to be broadcasted.
   */
  signTx: (
    callData: Uint8Array,
    signedExtensions: Record<
      string,
      {
        identifier: string
        value: Uint8Array
        additionalSigned: Uint8Array
      }
    >,
    metadata: Uint8Array,
    atBlockNumber: number,
    hasher?: (data: Uint8Array) => Uint8Array,
  ) => Promise<Uint8Array>
  /**
   * Signs an arbitrary payload.
   *
   * The signer may enforce certain restrictions to ensure that raw bytes passed
   * do not constitute, for instance, a valid extrinsic.
   *
   * @param data  The payload to be signed.
   * @returns A raw cryptographic signature.
   */
  signBytes: (data: Uint8Array) => Promise<Uint8Array>
}
