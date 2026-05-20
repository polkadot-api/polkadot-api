import { TxCreator } from "@polkadot-api/polkadot-signer"
import { Observable } from "rxjs"

interface Block {
  hash: string
  number: number
  parent: string
}

// @ts-ignore
type Alternative =
  | {
      type: "finalized"
      finalized: Block
      tips: Array<Block>
    }
  | {
      type: "newTip"
      finalized: Block
      tips: Array<Block>
      newTip: Block
    }

type Blocks = Observable<{
  finalized: Block
  tips: Array<Block>
}>

type RuntimeCall = (
  call: string,
  args: Uint8Array,
  at: string,
) => Promise<Uint8Array>

export type TxCreatorBindings = {
  blocks: Blocks
  // getBlock: (hash: string) => Block // TODO: let's see if we want it
  call: RuntimeCall
}

export type TxCreatorChain<Asset = unknown> = {
  txCreatorBindings: TxCreatorBindings
  __asset?: Asset
}

export type TxCreatorChainAsset<Chain> = Chain extends {
  __asset?: infer Asset
}
  ? Asset
  : void

export interface ChainAwareTxCreatorOptions {
  readonly __txCreatorChain?: TxCreatorChain
  readonly __txCreatorOptions?: unknown
}

export type ResolveTxCreatorOptions<
  T,
  Chain extends TxCreatorChain,
> = T extends ChainAwareTxCreatorOptions
  ? (T & { readonly __txCreatorChain: Chain })["__txCreatorOptions"]
  : T

export interface MergedTxCreatorOptions<
  A,
  B,
> extends ChainAwareTxCreatorOptions {
  readonly __txCreatorOptions: ResolveTxCreatorOptions<
    A,
    NonNullable<this["__txCreatorChain"]>
  > &
    ResolveTxCreatorOptions<B, NonNullable<this["__txCreatorChain"]>>
}

export type TxCreatorFactory<T> = <Chain extends TxCreatorChain>(
  chain: Chain,
) => TxCreator<ResolveTxCreatorOptions<T, Chain>>

export type TxCreatorEnhancer<T> = <A>(
  inner: TxCreatorFactory<A>,
) => TxCreatorFactory<MergedTxCreatorOptions<T, A>>
