import { fromHex, toHex } from "@unstoppablejs/utils"
import { keccak_256 } from "@noble/hashes/sha3"
import { toInternalBytes } from "../internal"
import { createCodec } from "../utils"

export const address = createCodec(
  (input: string) => {
    const result = new Uint8Array(32)
    result.set(fromHex(input), 12)
    return result
  },
  toInternalBytes((bytes) => {
    const binaryAddress = new Uint8Array(bytes.buffer, bytes.i + 12, 20)
    bytes.i += 32
    const nonChecksum = toHex(binaryAddress)
    const hashedAddres = toHex(keccak_256(nonChecksum.slice(2)))

    const result = new Array(41)
    result[0] = "0x"
    for (let i = 2; i < 42; i++) {
      const char = nonChecksum[i]
      result.push(parseInt(hashedAddres[i], 16) > 7 ? char.toUpperCase() : char)
    }

    return result.join("")
  }),
)
