import type {
  MergedTxCreatorOptions,
  ResolveTxCreatorOptions,
  TxCreatorChain,
} from "../src/tx-creator/types"
import type { CommonTxCreatorOptions } from "../src/tx-creator/common-enhancer"

type Equals<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false

type Expect<T extends true> = T

type Asset = { id: number }
type AssetChain = TxCreatorChain<Asset>
type NativeChain = TxCreatorChain

type AssetCommonOpts = ResolveTxCreatorOptions<
  CommonTxCreatorOptions,
  AssetChain
>
type NativeCommonOpts = ResolveTxCreatorOptions<
  CommonTxCreatorOptions,
  NativeChain
>
type MergedOpts = ResolveTxCreatorOptions<
  MergedTxCreatorOptions<CommonTxCreatorOptions, { nonce?: number }>,
  AssetChain
>

export type AssetCommonOptsIncludeTypedAsset = Expect<
  Equals<AssetCommonOpts["asset"], Asset | undefined>
>
export type NativeCommonOptsDoNotExposeAsset = Expect<
  Equals<"asset" extends keyof NativeCommonOpts ? true : false, false>
>
export type MergedOptsIncludeNonce = Expect<
  Equals<MergedOpts["nonce"], number | undefined>
>
export type MergedOptsIncludeTypedAsset = Expect<
  Equals<MergedOpts["asset"], Asset | undefined>
>
