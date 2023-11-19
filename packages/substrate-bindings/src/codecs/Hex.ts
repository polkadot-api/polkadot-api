import { fromHex, toHex } from "@polkadot-api/utils"
import { Bytes, Codec, Decoder, Encoder, createCodec } from "scale-ts"

export type HexString = string & { __hexString?: unknown }

const enc = (nBytes?: number): Encoder<HexString> => {
  const _enc = Bytes.enc(nBytes)
  return (value: string) => _enc(fromHex(value))
}

const dec = (nBytes?: number): Decoder<HexString> => {
  const _dec = Bytes.dec(nBytes)
  return (value) => toHex(_dec(value)) as HexString
}

export const Hex = (nBytes?: number): Codec<HexString> =>
  createCodec(enc(nBytes), dec(nBytes))

Hex.enc = enc
Hex.dec = dec
