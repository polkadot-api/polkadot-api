import { fromHex, toHex } from "@unstoppablejs/utils"
import { Bytes, Codec, enhanceCodec, Encoder, Decoder } from "../"

export const Hex = (nBytes: number): Codec<string> =>
  enhanceCodec(Bytes(nBytes), fromHex, toHex)

export const HexEnc = (nBytes: number): Encoder<string> => Hex(nBytes).enc

export const HexDec = (nBytes: number): Decoder<string> => Hex(nBytes).dec
