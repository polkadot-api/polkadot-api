import {
  Blake2256,
  V15,
  compact,
  enhanceEncoder,
  metadata as metadataCodec,
  u8,
} from "@polkadot-api/substrate-bindings"
import { mergeUint8 } from "@polkadot-api/utils"
import type { PolkadotSigner } from "@polkadot-api/polkadot-signer"

const versionCodec = enhanceEncoder(
  u8.enc,
  (value: { signed: boolean; version: number }) =>
    (+!!value.signed << 7) | value.version,
)

const signingTypeId: Record<"Ecdsa" | "Ed25519" | "Sr25519", number> = {
  Ed25519: 0,
  Sr25519: 1,
  Ecdsa: 2,
}

export function getPolkadotSigner(
  publicKey: Uint8Array,
  signingType: "Ecdsa" | "Ed25519" | "Sr25519",
  sign: (input: Uint8Array) => Promise<Uint8Array> | Uint8Array,
): PolkadotSigner {
  const polkadotSign = async (
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
    let decMeta: V15
    try {
      const tmpMeta = metadataCodec.dec(metadata)
      if (tmpMeta.metadata.tag !== "v15") throw null
      decMeta = tmpMeta.metadata.value
    } catch (_) {
      throw new Error("Unsupported metadata version")
    }

    const { version } = decMeta.extrinsic
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

    const preResult = mergeUint8(
      versionCodec({ signed: true, version }),
      // converting it to a `MultiAddress` enum, where the index 0 is `Id(AccountId)`
      new Uint8Array([0, ...publicKey]),
      new Uint8Array([signingTypeId[signingType], ...signed]),
      ...extra,
      callData,
    )

    return mergeUint8(compact.enc(preResult.length), preResult)
  }

  return { publicKey, sign: polkadotSign }
}
