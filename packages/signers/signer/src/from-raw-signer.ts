import { mergeUint8 } from "@polkadot-api/utils"
import type { PolkadotSigner } from "@polkadot-api/polkadot-signer"
import { getSignBytes, createV4Tx } from "@polkadot-api/signers-common"
import {
  Blake2256,
  decAnyMetadata,
  normalizeMetadata,
} from "@polkadot-api/substrate-bindings"

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
    const decMeta = normalizeMetadata(decAnyMetadata(metadata))
    const extra: Array<Uint8Array> = []
    const additionalSigned: Array<Uint8Array> = []
    decMeta.extrinsic.signedExtensions.map(({ identifier }) => {
      const signedExtension = signedExtensions[identifier]
      if (!signedExtension)
        throw new Error(`Missing ${identifier} signed extension`)
      extra.push(signedExtension.value)
      additionalSigned.push(signedExtension.additionalSigned)
    })

    const toSign = mergeUint8(callData, ...extra, ...additionalSigned)
    const signed = await sign(toSign.length > 256 ? hasher(toSign) : toSign)
    return createV4Tx(decMeta, publicKey, signed, extra, callData, signingType)
  }

  return {
    publicKey,
    signTx,
    signBytes: getSignBytes(sign),
  }
}
