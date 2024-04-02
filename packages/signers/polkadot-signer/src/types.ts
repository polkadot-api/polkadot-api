export interface PolkadotSigner {
  publicKey: Uint8Array
  sign: (
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
}
