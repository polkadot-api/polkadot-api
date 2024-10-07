import {
  getDynamicBuilder,
  MetadataLookup,
} from "@polkadot-api/metadata-builders"
import { _void } from "@polkadot-api/substrate-bindings"
import {
  ChargeAssetTxPayment,
  ChargeTransactionPayment,
  CheckMortality,
} from "./user"
import {
  CheckGenesis,
  CheckMetadataHash,
  CheckNonce,
  CheckSpecVersion,
} from "./chain"
import { TxData } from "@/types"
import { SignedExtension } from "./internal-types"
import { EMPTY_SIGNED_EXTENSION } from "./utils"
import { mergeUint8 } from "@polkadot-api/utils"

export const getSignedExtensionParts = (
  lookup: MetadataLookup,
  dynamicBuilder: ReturnType<typeof getDynamicBuilder>,
  data: TxData,
) => {
  const { tip, mortality, genesisHash, nonce, asset, metadataHash } = data
  const signedExtensions = lookup.metadata.extrinsic.signedExtensions.map(
    ({ identifier, type, additionalSigned }): SignedExtension => {
      switch (identifier) {
        case "CheckGenesis":
          return CheckGenesis(genesisHash)
        case "CheckMetadataHash":
          return CheckMetadataHash(metadataHash)
        case "CheckNonce":
          return CheckNonce(nonce)
        case "CheckSpecVersion":
          return CheckSpecVersion(lookup)
        case "ChargeAssetTxPayment":
          return ChargeAssetTxPayment(tip, asset)
        case "ChargeTransactionPayment":
          return ChargeTransactionPayment(tip)
        case "CheckMortality":
          return CheckMortality(mortality)
      }

      if (
        dynamicBuilder.buildDefinition(type) === _void &&
        dynamicBuilder.buildDefinition(additionalSigned) === _void
      )
        return EMPTY_SIGNED_EXTENSION

      throw new Error(`Unsupported signed-extension: ${identifier}`)
    },
  )

  const signedExtensionsRecord = Object.fromEntries(
    lookup.metadata.extrinsic.signedExtensions.map(({ identifier }, idx) => [
      identifier,
      { identifier, ...signedExtensions[idx] },
    ]),
  )

  let extraParts: Uint8Array[] = []
  let additionalSignedParts: Uint8Array[] = []
  lookup.metadata.extrinsic.signedExtensions.map(({ identifier }) => {
    const signedExtension = signedExtensionsRecord[identifier]
    if (!signedExtension)
      throw new Error(`Missing ${identifier} signed extension`)
    extraParts.push(signedExtension.value)
    additionalSignedParts.push(signedExtension.value)
  })

  const extra = mergeUint8(...extraParts)
  const additionalSigned = mergeUint8(...additionalSignedParts)

  return { extra, additionalSigned }
}
