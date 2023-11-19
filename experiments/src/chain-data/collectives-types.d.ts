import {
  u16,
  Codec,
  CodecType,
  SS58String,
} from "@polkadot-api/substrate-bindings"
type Icdc60Tupled = Codec<[CodecType<typeof u16>]>
declare const cdc60Tupled: Icdc60Tupled
export type cdc60Tupled = CodecType<typeof cdc60Tupled>
declare const _accountId: Codec<SS58String>
export type _accountId = CodecType<typeof _accountId>
type IcSp_coreCryptoAccountId32Tupled = Codec<[CodecType<typeof _accountId>]>
declare const cSp_coreCryptoAccountId32Tupled: IcSp_coreCryptoAccountId32Tupled
export type cSp_coreCryptoAccountId32Tupled = CodecType<
  typeof cSp_coreCryptoAccountId32Tupled
>
export {}
