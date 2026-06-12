import { getLookupFromRawMetadata } from "@/lookupFromMetadata"
import {
  getDynamicBuilder,
  MetadataLookup,
} from "@polkadot-api/metadata-builders"
import {
  ArgsForArgSpecs,
  TxArgSpec,
  TxChainDefinition,
  TxCreatorBindings,
  TxCreatorEnhancer,
  TxPayloadV1,
} from "@polkadot-api/polkadot-signer"
import { compact } from "@polkadot-api/substrate-bindings"
import { toHex } from "@polkadot-api/utils"
import { firstValueFrom, skipWhile } from "rxjs"
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

const enhancerFromExtensionPayload =
  <T extends TxArgSpec>(
    id: T["id"],
    mapFn: (opts: {
      bindings: TxCreatorBindings
      context: TxPayloadV1["context"]
      lookupFn: MetadataLookup
      dynamicBuilder: ReturnType<typeof getDynamicBuilder>
      opts: ArgsForArgSpecs<[T], TxChainDefinition>
    }) => Promise<{ extra: string; additionalSigned: string }>,
  ): TxCreatorEnhancer<[T]> =>
  (inner) =>
  async (payload, opts, bindings, mocked) => {
    if (payload.extensions.some((ext) => ext.id === id))
      return inner(payload, opts, bindings, mocked)

    const { lookupFn, builder } = getLookupFromRawMetadata(
      payload.context.metadata,
    )
    if (!(id in lookupFn.metadata.extrinsic.extensions))
      return inner(payload, opts, bindings, mocked)

    const myOptions = opts as ArgsForArgSpecs<[T], TxChainDefinition>
    const extension = await mapFn({
      bindings,
      context: payload.context,
      dynamicBuilder: builder,
      lookupFn,
      opts: myOptions,
    })

    return inner(
      {
        ...payload,
        extensions: [
          ...payload.extensions,
          {
            id,
            ...extension,
          },
        ],
      },
      opts,
      bindings,
      mocked,
    )
  }

export const withCheckGenesis = enhancerFromExtensionPayload<
  TxArgSpec & {
    id: "CheckGenesis"
    params: {}
  }
>("CheckGenesis", async ({ context: { genesisHash } }) =>
  additionalSigned(genesisHash),
)

export const withCheckMetadataHash = enhancerFromExtensionPayload<
  TxArgSpec & {
    id: "CheckMetadataHash"
    params: {}
  }
>("CheckMetadataHash", async () => both(zero, zero))

export const withCheckSpecVersion = enhancerFromExtensionPayload<
  TxArgSpec & {
    id: "CheckSpecVersion"
    params: {}
  }
>("CheckSpecVersion", async ({ lookupFn, dynamicBuilder }) =>
  additionalSigned(
    getSystemVersionProp(
      lookupFn,
      dynamicBuilder,
      "CheckSpecVersion",
      "spec_version",
    ),
  ),
)

export const withCheckTxVersion = enhancerFromExtensionPayload<
  TxArgSpec & {
    id: "CheckTxVersion"
    params: {}
  }
>("CheckTxVersion", async ({ lookupFn, dynamicBuilder }) =>
  additionalSigned(
    getSystemVersionProp(
      lookupFn,
      dynamicBuilder,
      "CheckTxVersion",
      "transaction_version",
    ),
  ),
)

export const withChargeTransactionPayment = enhancerFromExtensionPayload<
  TxArgSpec & {
    id: "ChargeTransactionPayment"
    params: {
      tip?: bigint
    }
  }
>("ChargeTransactionPayment", async ({ opts: { tip } }) =>
  value(toHex(compact.enc(tip ?? 0))),
)

export const withCheckMortality = enhancerFromExtensionPayload<
  TxArgSpec & {
    id: "CheckMortality"
    params: {
      /**
       * Mortality of the transaction.
       * If no `at` is passed, transaction will be alive for, at least, `period`
       * number of blocks after the current best block height.
       * If `at` is passed, transaction will be alive for `period` number of
       * blocks after `at`.
       *
       * Default: `{ mortal: true, period: 20 }`
       */
      mortality?:
        | { mortal: false }
        | {
            mortal: true
            period: number
            at?: { hash: string; number: number }
          }
    }
  }
>(
  "CheckMortality",
  async ({
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
)

type ChargeAssetTransactionPaymentParams<Chain extends TxChainDefinition> = {
  /**
   * Tip in fundamental units. Default: `0`
   */
  tip?: bigint
  /**
   * Asset to pay fees with. Default: `None`
   */
  asset?: Chain["extensions"]["ChargeAssetTxPayment"]["value"] extends {
    asset_id: infer A
  }
    ? A
    : never
}
export interface ChargeAssetTxPaymentSpec extends TxArgSpec {
  id: "ChargeAssetTxPayment"
  params: ChargeAssetTransactionPaymentParams<this["chain"]>
}
export const withChargeAssetTxPayment =
  enhancerFromExtensionPayload<ChargeAssetTxPaymentSpec>(
    "ChargeAssetTxPayment",
    async ({ opts: { tip, asset }, lookupFn, dynamicBuilder }) => {
      const { enc } = dynamicBuilder.buildDefinition(
        lookupFn.metadata.extrinsic.extensions["ChargeAssetTxPayment"].type,
      )
      return value(toHex(enc({ tip: tip ?? 0, asset_id: asset })))
    },
  )
