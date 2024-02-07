import { Bytes, Variant } from "@polkadot-api/substrate-bindings"

export const signatureEncoder = Variant({
  Ed25519: Bytes(64),
  Sr25519: Bytes(64),
  Ecdsa: Bytes(65),
}).enc
