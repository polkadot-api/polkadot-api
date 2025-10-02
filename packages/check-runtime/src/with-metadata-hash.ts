import { merkleizeMetadata } from "@polkadot-api/merkleize-metadata"
import type { PolkadotSigner } from "polkadot-api"
import { mergeUint8 } from "polkadot-api/utils"

const EXTENSION_ID = "CheckMetadataHash"

export const withMetadataHash = (
  signer: PolkadotSigner,
  info: { decimals: number; tokenSymbol: string },
  customMetadata?: Uint8Array,
): PolkadotSigner => {
  return {
    ...signer,
    signTx: async (callData, extensions, metadata, ...rest) => {
      const merkleizer = merkleizeMetadata(customMetadata ?? metadata, info)

      return signer.signTx(
        callData,
        {
          ...extensions,
          [EXTENSION_ID]: {
            identifier: EXTENSION_ID,
            value: Uint8Array.from([1]),
            additionalSigned: mergeUint8([
              Uint8Array.from([1]),
              merkleizer.digest(),
            ]),
          },
        },
        metadata,
        ...rest,
      )
    },
  }
}
