import { Bytes, Enum } from "@polkadot-api/substrate-bindings"

export const signatureEncoder = Enum({
  Ed25519: Bytes(64),
  Sr25519: Bytes(64),
  Ecdsa: Bytes(65),
}).enc
