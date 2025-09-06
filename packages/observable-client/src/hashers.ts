import {
  Blake2256,
  Keccak256,
  type HexString,
} from "@polkadot-api/substrate-bindings"
import { fromHex, toHex } from "@polkadot-api/utils"

export type Hasher = (input: Uint8Array) => Uint8Array
const hashers: Array<Hasher> = [Blake2256, Keccak256]
export const getHasherFromHeader = (
  header: HexString,
  blockHash: HexString,
): Hasher =>
  hashers.find((h) => toHex(h(fromHex(header))) === blockHash) ||
  (() => {
    throw new Error("Unsupported hasher")
  })
