import { fromHex, toHex } from "@polkadot-api/utils"
import { Bytes, createCodec, createDecoder } from "scale-ts"
import { Keccak256 } from "../../hashes"
import { textEncoder } from "./fixed-str"

const getFormattedAddress = (hexAddress: string) => {
  const nonChecksum = hexAddress.slice(2)
  const hashedAddress = toHex(Keccak256(textEncoder.encode(nonChecksum))).slice(
    2,
  )
  const result = new Array(40)

  for (let i = 0; i < 40; i++) {
    const checksumVal = parseInt(hashedAddress[i], 16)
    const char = nonChecksum[i]
    result[i] = checksumVal > 7 ? char.toUpperCase() : char
  }

  return `0x${result.join("")}`
}

const bytes20Dec = Bytes(20)[1]

export const ethAccount = createCodec<string>(
  (input: string) => {
    const bytes = fromHex(input)
    if (bytes.length !== 20)
      throw new Error(`Invalid length found on EthAddress(${input})`)

    const hexAddress = toHex(bytes)
    if (input === hexAddress || input === hexAddress.toUpperCase()) return bytes

    if (getFormattedAddress(hexAddress) !== input)
      throw new Error(`Invalid checksum found on EthAddress(${input})`)

    return bytes
  },
  createDecoder((bytes) => getFormattedAddress(toHex(bytes20Dec(bytes)))),
)
