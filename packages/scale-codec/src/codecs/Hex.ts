import { fromHex, toHex } from "@unstoppablejs/utils"
import { createCodec, enhanceDecoder, enhanceEncoder } from "../utils"
import { Bytes, Codec } from "../"

const HexEnc = (nBytes: number) => enhanceEncoder(Bytes.enc(nBytes), fromHex)
const HexDec = (nBytes: number) => enhanceDecoder(Bytes.dec(nBytes), toHex)

export const Hex = (nBytes: number): Codec<string> =>
  createCodec(HexEnc(nBytes), HexDec(nBytes))

Hex.enc = HexEnc
Hex.dec = HexDec
