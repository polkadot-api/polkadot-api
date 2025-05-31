import type { RuntimeContext } from "@/chainHead"
import {
  AccountId,
  type UnifiedMetadata,
} from "@polkadot-api/substrate-bindings"
import { getDynamicBuilder, getLookupFn } from "@polkadot-api/metadata-builders"

export const createRuntimeCtx = (
  metadata: UnifiedMetadata,
  metadataRaw: Uint8Array,
  codeHash: string,
): RuntimeContext => {
  const lookup = getLookupFn(metadata)
  const dynamicBuilder = getDynamicBuilder(lookup)
  const events = dynamicBuilder.buildStorage("System", "Events")

  const assetPayment = metadata.extrinsic.signedExtensions.find(
    (x) => x.identifier === "ChargeAssetTxPayment",
  )

  let assetId: null | number = null
  if (assetPayment) {
    const assetTxPayment = lookup(assetPayment.type)
    if (assetTxPayment.type === "struct") {
      const optionalAssetId = assetTxPayment.value.asset_id
      if (optionalAssetId.type === "option") assetId = optionalAssetId.value.id
    }
  }

  return {
    assetId,
    metadataRaw,
    codeHash,
    lookup,
    dynamicBuilder,
    events: {
      key: events.keys.enc(),
      dec: events.value.dec as any,
    },
    accountId: AccountId(dynamicBuilder.ss58Prefix),
  }
}
