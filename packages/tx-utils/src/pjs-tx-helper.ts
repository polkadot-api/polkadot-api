import { getDynamicBuilder, getLookupFn } from "@polkadot-api/metadata-builders"
import {
  _void,
  Blake2256,
  compact,
  extrinsicFormat,
  UnifiedMetadata,
} from "@polkadot-api/substrate-bindings"
import { fromHex, mapObject, mergeUint8 } from "@polkadot-api/utils"
import { SignerPayloadJSON } from "./types"
import { fromPjsToTxData } from "./from-pjs-to-tx-data"
import { getSignedExtensionParts } from "./signed-extensions"
import { getMetadata } from "./get-metadata"
import { SignedExtension } from "./signed-extensions/internal-types"

const signingTypeId: Record<"Ecdsa" | "Ed25519" | "Sr25519", number> = {
  Ed25519: 0,
  Sr25519: 1,
  Ecdsa: 2,
}

export const getPjsTxHelper = (
  metadata: Uint8Array | string,
  customExtensionMappers: Record<
    string,
    (ctx: {
      pjsPayload: SignerPayloadJSON
      unifiedMeta: UnifiedMetadata
    }) => SignedExtension
  > = {},
) => {
  const unifiedMeta = getMetadata(metadata)
  const lookup = getLookupFn(unifiedMeta)
  const dynamicBuilder = getDynamicBuilder(lookup)

  return (pjsPayload: SignerPayloadJSON) => {
    const { extra, additionalSigned } = getSignedExtensionParts(
      lookup,
      dynamicBuilder,
      fromPjsToTxData(lookup.metadata, pjsPayload),
      mapObject(customExtensionMappers, (fn) =>
        fn({ pjsPayload, unifiedMeta }),
      ),
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
        const checkedVersion = version.includes(4) ? 4 : null
        if (checkedVersion == null)
          throw new Error("Only extrinsic v4 is supported")

        const toSign = mergeUint8([callData, extra, additionalSigned])
        const signed = await sign(toSign.length > 256 ? hasher(toSign) : toSign)

        const preResult = mergeUint8([
          extrinsicFormat.enc({ version: checkedVersion, type: "signed" }),
          // converting it to a `MultiAddress` enum, where the index 0 is `Id(AccountId)`
          new Uint8Array([0, ...publicKey]),
          new Uint8Array([signingTypeId[signingType], ...signed]),
          extra,
          callData,
        ])
        return mergeUint8([compact.enc(preResult.length), preResult])
      },
    }
  }
}
