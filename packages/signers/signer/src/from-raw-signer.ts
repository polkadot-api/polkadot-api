import { mergeUint8 } from "@polkadot-api/utils"
import type { PolkadotSigner } from "@polkadot-api/polkadot-signer"
import { keccak_256 } from "@noble/hashes/sha3"
import {
  getSignBytes,
  SignerType,
  v4TxHelper,
} from "@polkadot-api/signers-common"
import {
  Blake2256,
  decAnyMetadata,
  V14,
  V15,
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
    let decMeta: V14 | V15
    try {
      const tmpMeta = decAnyMetadata(metadata)
      if (tmpMeta.metadata.tag !== "v14" && tmpMeta.metadata.tag !== "v15")
        throw null
      decMeta = tmpMeta.metadata.value
    } catch (_) {
      throw new Error("Unsupported metadata version")
    }
    const { signerType, createTx } = v4TxHelper(decMeta)

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
    const signed = await sign(
      signerType === SignerType.Ethereum
        ? keccak_256(toSign)
        : toSign.length > 256
          ? hasher(toSign)
          : toSign,
    )
    return createTx(publicKey, signed, extra, callData, signingType)
  }

  return {
    publicKey,
    signTx,
    signBytes: getSignBytes(sign),
  }
}
