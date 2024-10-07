import { getDynamicBuilder, getLookupFn } from "@polkadot-api/metadata-builders"
import {
  _void,
  Blake2256,
  compact,
  enhanceEncoder,
  u8,
} from "@polkadot-api/substrate-bindings"
import { fromHex, mergeUint8 } from "@polkadot-api/utils"
import { SignerPayloadJSON } from "./types"
import { fromPjsToTxData } from "./from-pjs-to-tx-data"
import { getSignedExtensionParts } from "./signed-extensions"
import { getMetadata } from "./get-metadata"

const versionEncoder = enhanceEncoder(
  u8.enc,
  (value: { signed: boolean; version: number }) =>
    (+!!value.signed << 7) | value.version,
)

const signingTypeId: Record<"Ecdsa" | "Ed25519" | "Sr25519", number> = {
  Ed25519: 0,
  Sr25519: 1,
  Ecdsa: 2,
}

export const getPjsTxHelper = (metadata: Uint8Array | string) => {
  const lookup = getLookupFn(getMetadata(metadata))
  const dynamicBuilder = getDynamicBuilder(lookup)

  return (pjsPayload: SignerPayloadJSON) => {
    const { extra, additionalSigned } = getSignedExtensionParts(
      lookup,
      dynamicBuilder,
      fromPjsToTxData(lookup.metadata, pjsPayload),
    )
    const callData = fromHex(pjsPayload.method)

    return {
      callData,
      extra,
      additionalSigned,
      createTx: async (
        publicKey: Uint8Array,
        signingType: "Ecdsa" | "Ed25519" | "Sr25519",
        sign: (input: Uint8Array) => Uint8Array | Promise<Uint8Array>,
        hasher = Blake2256,
      ) => {
        const { version } = lookup.metadata.extrinsic

        const toSign = mergeUint8(callData, extra, additionalSigned)
        const signed = await sign(toSign.length > 256 ? hasher(toSign) : toSign)

        const preResult = mergeUint8(
          versionEncoder({ signed: true, version }),
          // converting it to a `MultiAddress` enum, where the index 0 is `Id(AccountId)`
          new Uint8Array([0, ...publicKey]),
          new Uint8Array([signingTypeId[signingType], ...signed]),
          extra,
          callData,
        )
        return mergeUint8(compact.enc(preResult.length), preResult)
      },
    }
  }
}
