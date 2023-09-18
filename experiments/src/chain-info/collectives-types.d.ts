import { Codec, CodecType } from "@polkadot-api/substrate-bindings"
declare const _accountId: Codec<
  import("@polkadot-api/substrate-bindings").SS58String
>
export type _accountId = CodecType<typeof _accountId>
declare const cSp_coreCryptoAccountId32Tupled: Codec<
  [key: CodecType<typeof _accountId>]
>
export type cSp_coreCryptoAccountId32Tupled = CodecType<
  typeof cSp_coreCryptoAccountId32Tupled
>
export {}
