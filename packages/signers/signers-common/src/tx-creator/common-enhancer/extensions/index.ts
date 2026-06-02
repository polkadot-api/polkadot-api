import {
  getDynamicBuilder,
  MetadataLookup,
} from "@polkadot-api/metadata-builders"
import { TxPayloadV1 } from "@polkadot-api/polkadot-signer"
import { compact } from "@polkadot-api/substrate-bindings"
import { toHex } from "@polkadot-api/utils"
import { firstValueFrom, skipWhile } from "rxjs"
import type { CommonOpts } from ".."
import { TxCreatorBindings } from "../../types"
import { mortal } from "./mortal-enc"
import { getSystemVersionProp } from "./system-version"

const empty = "0x"
const zero = "0x00"
const value = (extra: string) => ({
  extra,
  additionalSigned: empty,
})
const additionalSigned = (additionalSigned: string) => ({
  extra: empty,
  additionalSigned,
})
const both = (extra: string, additionalSigned: string) => ({
  extra,
  additionalSigned,
})

export const extensions: Record<
  string,
  (opts: {
    bindings: TxCreatorBindings
    context: TxPayloadV1["context"]
    lookupFn: MetadataLookup
    dynamicBuilder: ReturnType<typeof getDynamicBuilder>
    opts: CommonOpts
  }) => Promise<{ extra: string; additionalSigned: string }>
> = {
  CheckGenesis: async ({ context: { genesisHash } }) =>
    additionalSigned(genesisHash),
  CheckMetadataHash: async () => both(zero, zero),
  CheckSpecVersion: async ({ lookupFn, dynamicBuilder }) =>
    additionalSigned(
      getSystemVersionProp(
        lookupFn,
        dynamicBuilder,
        "CheckSpecVersion",
        "spec_version",
      ),
    ),

  CheckTxVersion: async ({ lookupFn, dynamicBuilder }) =>
    additionalSigned(
      getSystemVersionProp(
        lookupFn,
        dynamicBuilder,
        "CheckTxVersion",
        "transaction_version",
      ),
    ),
  CheckMortality: async ({
    bindings: { blocks },
    context: { genesisHash },
    opts: { mortality },
  }) => {
    if (mortality?.mortal === false) return both(zero, genesisHash)
    mortality ??= { period: 20, mortal: true }
    if (mortality.at)
      return both(
        toHex(
          mortal({
            // 4096 is the maximum value the codec can safely encode
            period: Math.min(mortality.period, 4096),
            startAtBlock: mortality.at.number,
          }),
        ),
        mortality.at.hash,
      )
    const { finalized, tips } = await firstValueFrom(
      // with first finalized we know the observable is settled
      blocks.pipe(skipWhile(({ type }) => type !== "finalized")),
    )
    const higherHeight = Math.max(...tips.map(({ number }) => number))
    const heightDiff = higherHeight - finalized.number
    return both(
      toHex(
        mortal({
          // 4096 is the maximum value the codec can safely encode
          period: Math.min(heightDiff + mortality.period, 4096),
          startAtBlock: finalized.number,
        }),
      ),
      finalized.hash,
    )
  },
  ChargeTransactionPayment: async ({ opts: { tip } }) =>
    value(toHex(compact.enc(tip ?? 0))),
  ChargeAssetTxPayment: async ({
    opts: { tip, asset },
    lookupFn,
    dynamicBuilder,
  }) => {
    const { enc } = dynamicBuilder.buildDefinition(
      lookupFn.metadata.extrinsic.extensions["ChargeAssetTxPayment"].type,
    )
    return value(toHex(enc({ tip: tip ?? 0, asset_id: asset })))
  },
}
