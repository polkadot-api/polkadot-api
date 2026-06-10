import { getLookupFromRawMetadata } from "@/lookupFromMetadata"
import {
  TxArgSpec,
  TxCreator,
  TxCreatorEnhancer,
} from "@polkadot-api/polkadot-signer"
import { toHex } from "@polkadot-api/utils"
import {
  withChargeAssetTxPayment,
  withChargeTransactionPayment,
  withCheckGenesis,
  withCheckMetadataHash,
  withCheckMortality,
  withCheckSpecVersion,
  withCheckTxVersion,
} from "./extensions"

export type { ChargeAssetTxPaymentSpec } from "./extensions"

type EnhancerSpecs<E> = E extends TxCreatorEnhancer<infer T> ? T : never
type PipeEnhancerSpecs<
  Enhancers extends readonly TxCreatorEnhancer<TxArgSpec[]>[],
  Acc extends TxArgSpec[] = [],
> = Enhancers extends readonly [
  infer Head extends TxCreatorEnhancer<TxArgSpec[]>,
  ...infer Tail extends readonly TxCreatorEnhancer<TxArgSpec[]>[],
]
  ? PipeEnhancerSpecs<Tail, [...EnhancerSpecs<Head>, ...Acc]>
  : Acc

function pipe<Enhancers extends readonly TxCreatorEnhancer<TxArgSpec[]>[]>(
  ...enhancers: Enhancers
): TxCreatorEnhancer<PipeEnhancerSpecs<Enhancers>> {
  return ((inner: TxCreator<TxArgSpec[]>) =>
    enhancers.reduce(
      (acc, enhancer) => enhancer(acc),
      inner,
    )) as TxCreatorEnhancer<PipeEnhancerSpecs<Enhancers>>
}

const withEmptyExtensions: TxCreatorEnhancer<[]> =
  (inner) => async (payload, opts, bindings, mocked) => {
    const extensions = [...payload.extensions]
    const foundExts = extensions.reduce(
      (acc, val) => {
        acc[val.id] = val
        return acc
      },
      {} as Record<string, (typeof payload.extensions)[number]>,
    )

    const { lookupFn, builder } = getLookupFromRawMetadata(
      payload.context.metadata,
    )

    Object.values(lookupFn.metadata.extrinsic.extensions).forEach(
      ({ identifier, type, additionalSigned }) => {
        if (identifier in foundExts) return

        // Try filling it in as void
        try {
          const exp = builder.buildDefinition(type).enc(undefined)
          const imp = builder.buildDefinition(additionalSigned).enc(undefined)
          extensions.push({
            id: identifier,
            extra: toHex(exp),
            additionalSigned: toHex(imp),
          })
        } catch {
          return
        }
      },
    )

    return inner(
      {
        ...payload,
        extensions,
      },
      opts,
      bindings,
      mocked,
    )
  }

export const withCommonExtensions = pipe(
  withEmptyExtensions,
  withChargeAssetTxPayment,
  withChargeTransactionPayment,
  withCheckGenesis,
  withCheckMetadataHash,
  withCheckMortality,
  withCheckSpecVersion,
  withCheckTxVersion,
)
