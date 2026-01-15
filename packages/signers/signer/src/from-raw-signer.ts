import { mergeUint8 } from "@polkadot-api/utils"
import type { PolkadotSigner } from "@polkadot-api/polkadot-signer"
import { getSignBytes, createV4Tx } from "@polkadot-api/signers-common"
import {
  Blake2256,
  decAnyMetadata,
  unifyMetadata,
} from "@polkadot-api/substrate-bindings"
import { merkleizeMetadata } from "@polkadot-api/merkleize-metadata"

export function getPolkadotSigner(
  publicKey: Uint8Array,
  signingType: "Ecdsa" | "Ed25519" | "Sr25519",
  sign: (input: Uint8Array) => Promise<Uint8Array> | Uint8Array,
): PolkadotSigner {
  const signTx = async (
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
    _: number,
    hasher = Blake2256,
  ) => {
    const decMeta = unifyMetadata(decAnyMetadata(metadata))
    const extra: Array<Uint8Array> = []
    const additionalSigned: Array<Uint8Array> = []
    decMeta.extrinsic.signedExtensions[0].map(({ identifier }) => {
      const signedExtension = signedExtensions[identifier]
      if (!signedExtension)
        throw new Error(`Missing ${identifier} signed extension`)
      extra.push(signedExtension.value)
      additionalSigned.push(signedExtension.additionalSigned)
    })

    const toSign = mergeUint8([callData, ...extra, ...additionalSigned])
    const signed = await sign(toSign.length > 256 ? hasher(toSign) : toSign)
    return createV4Tx(decMeta, publicKey, signed, extra, callData, signingType)
  }

  return {
    publicKey,
    signTx,
    signBytes: getSignBytes(sign),
  }
}

const METADATA_IDENTIFIER = "CheckMetadataHash"
const oneU8 = Uint8Array.from([1])

export const withMetadataHash = (
  networkInfo: Parameters<typeof merkleizeMetadata>[1],
  base: PolkadotSigner,
): PolkadotSigner => ({
  ...base,
  signTx: async (callData, signedExtensions, metadata, ...rest) =>
    base.signTx(
      callData,
      signedExtensions[METADATA_IDENTIFIER]
        ? {
            ...signedExtensions,
            [METADATA_IDENTIFIER]: {
              identifier: METADATA_IDENTIFIER,
              value: oneU8,
              additionalSigned: mergeUint8([
                oneU8,
                merkleizeMetadata(metadata, networkInfo).digest(),
              ]),
            },
          }
        : signedExtensions,
      metadata,
      ...rest,
    ),
})
