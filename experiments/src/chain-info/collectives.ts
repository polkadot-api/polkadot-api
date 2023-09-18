import {
  u16,
  CodecType,
  getPalletCreator,
} from "@polkadot-api/substrate-bindings"
import type { ArgsWithPayloadCodec } from "@polkadot-api/substrate-bindings"
import type { cSp_coreCryptoAccountId32Tupled } from "./collectives-types"

const FellowshipCollectiveCreator = getPalletCreator("FellowshipCollective")

export type FellowshipCollectiveMembersStorage = {
  keyArgs: cSp_coreCryptoAccountId32Tupled
  value: CodecType<typeof u16>
}

const FellowshipCollectiveMembersStorage =
  FellowshipCollectiveCreator.getStorageDescriptor(
    13812838053771925107n,
    "Members",
    { len: 1 } as ArgsWithPayloadCodec<
      FellowshipCollectiveMembersStorage["keyArgs"],
      FellowshipCollectiveMembersStorage["value"]
    >,
  )

const result: [typeof FellowshipCollectiveMembersStorage] = [
  FellowshipCollectiveMembersStorage,
]

export default result
