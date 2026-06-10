import {
  TxArgSpec,
  TxCreator,
  TxCreatorEnhancer,
} from "@polkadot-api/polkadot-signer"
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

export const withCommonExtensions = pipe(
  withChargeAssetTxPayment,
  withChargeTransactionPayment,
  withCheckGenesis,
  withCheckMetadataHash,
  withCheckMortality,
  withCheckSpecVersion,
  withCheckTxVersion,
)
