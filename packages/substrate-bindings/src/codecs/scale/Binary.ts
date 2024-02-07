import { fromHex, toHex } from "@polkadot-api/utils"
import { Bytes, Codec, Decoder, Encoder, createCodec } from "scale-ts"
import { HexString } from "./Hex"

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

export interface Binary {
  asBytes: () => Uint8Array
  asHex: () => HexString
  asText: () => string
}

export const Binary: ((bytes: Uint8Array) => Binary) &
  ((hex: HexString) => Binary) &
  ((text: string) => Binary) = ((data: Uint8Array | HexString | string) => {
  let bytes: Uint8Array
  let hex: HexString | null = null
  let str: string | null = null

  if (data instanceof Uint8Array) {
    bytes = data
  } else if (data.match(/0[xX][0-9a-fA-F]+/)) {
    bytes = fromHex(data)
    hex = data
  } else {
    bytes = textEncoder.encode(data)
    str = data
  }

  return {
    asText: () => (str === null ? (str = textDecoder.decode(bytes)) : str),
    asHex: () => (hex === null ? (hex = toHex(bytes)) : hex),
    asBytes: () => bytes,
  }
}) as any

const enc = (nBytes?: number): Encoder<Binary> => {
  const _enc = Bytes.enc(nBytes)
  return (value) => _enc(value.asBytes())
}

const dec = (nBytes?: number): Decoder<Binary> => {
  const _dec = Bytes.dec(nBytes)
  return (value) => Binary(_dec(value))
}

export const Bin = (nBytes?: number): Codec<Binary> =>
  createCodec(enc(nBytes), dec(nBytes))

Bin.enc = enc
Bin.dec = dec
