import { Encoder } from "@polkadot-api/substrate-bindings"

export const multiAddressEncoder: Encoder<Uint8Array> = (input) =>
  // converting it to a `MultiAddress` enum, where the index 0 is `Id(AccountId)`
  new Uint8Array([0, ...input])
