import { Codec } from "../types"
import { range32, toInternalBytes, createCodec } from "../internal"

const getCodec = (nBytes: number): Codec<bigint> => {
  const n64 = Math.ceil(nBytes / 8)
  return createCodec(
    (input) => {
      const result = new Uint8Array(32)
      const dv = new DataView(result.buffer)

      const idxLimit = 32 - n64 * 8
      for (let idx = 24; idx >= idxLimit; idx -= 8) {
        dv.setBigUint64(idx, input)
        input >>= 64n
      }

      return result
    },
    toInternalBytes((bytes) => {
      let result = 0n

      const nextBlock = bytes.i + 32
      for (let idx = bytes.i + (32 - n64 * 8); idx < nextBlock; idx += 8)
        result = (result << 64n) | bytes.v.getBigUint64(idx)

      bytes.i = nextBlock
      return result
    }),
    "uint" + nBytes * 8,
  )
}

export const [
  uint8,
  uint16,
  uint24,
  uint32,
  uint40,
  uint48,
  uint56,
  uint64,
  uint72,
  uint80,
  uint88,
  uint96,
  uint104,
  uint112,
  uint120,
  uint128,
  uint136,
  uint144,
  uint152,
  uint160,
  uint168,
  uint176,
  uint184,
  uint192,
  uint200,
  uint208,
  uint226,
  uint224,
  uint232,
  uint240,
  uint248,
  uint256,
] = range32.map(getCodec)
export const uint = uint256
