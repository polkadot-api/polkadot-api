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

export type TxCreatorChain = {
  txCreatorBindings: TxCreatorBindings
  __asset?: unknown
}

export type AssetFromTxCreatorChain<Chain> = Chain extends {
  __asset?: infer Asset
}
  ? Asset
  : void

export interface TxCreatorOptionsProvider {
  readonly __txCreatorChain?: TxCreatorChain
  readonly __txCreatorOptions?: unknown
}

export type TxCreatorOptions<
  T,
  Chain extends TxCreatorChain,
> = T extends TxCreatorOptionsProvider
  ? (T & { readonly __txCreatorChain: Chain })["__txCreatorOptions"]
  : T

export interface MergeTxCreatorOptions<A, B> extends TxCreatorOptionsProvider {
  readonly __txCreatorOptions: TxCreatorOptions<
    A,
    NonNullable<this["__txCreatorChain"]>
  > &
    TxCreatorOptions<B, NonNullable<this["__txCreatorChain"]>>
}

export type TxCreatorFactory<T> = <Chain extends TxCreatorChain>(
  chain: Chain,
) => TxCreator<TxCreatorOptions<T, Chain>>

export type TxCreatorEnhancer<T> = <A>(
  inner: TxCreatorFactory<A>,
) => TxCreatorFactory<MergeTxCreatorOptions<T, A>>
