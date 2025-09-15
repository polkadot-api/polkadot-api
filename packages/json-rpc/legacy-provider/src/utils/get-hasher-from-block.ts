import { Blake2256, Keccak256 } from "@polkadot-api/substrate-bindings"
import { getFromShittyHeader } from "./fromShittyHeader"
import { ShittyHeader } from "@/types"

const hashers = [Blake2256, Keccak256]
const fns = hashers.map(getFromShittyHeader)
const noHasher = (_: Uint8Array): Uint8Array => {
  throw new Error("Hasher not supported")
}

export const getHasherFromBlock =
  (shitHeader: ShittyHeader) =>
  (hash: string): ((data: Uint8Array) => Uint8Array) =>
    hashers[fns.findIndex((fn) => fn(shitHeader).hash === hash)] || noHasher
