import { fromHex, toHex } from "@polkadot-api/utils"
import { Bytes, Codec, Decoder, Encoder, createCodec } from "scale-ts"
import { HexString } from "./Hex"

interface IBinary {
  asText: () => string
  asHex: () => HexString
  asBytes: () => Uint8Array
}

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()
export class Binary implements IBinary {
  private bytes: Uint8Array
  private hex: HexString | null = null
  private str: string | null = null

  constructor(bytes: Uint8Array)
  constructor(hex: HexString)
  constructor(text: string)
  constructor(data: Uint8Array | HexString | string) {
    if (data instanceof Uint8Array) {
      this.bytes = data
    } else if (data.match(/0[xX][0-9a-fA-F]+/)) {
      this.bytes = fromHex(data)
      this.hex = data
    } else {
      this.bytes = textEncoder.encode(data)
      this.str = data
    }
  }

  public asText() {
    return this.str === null
      ? (this.str = textDecoder.decode(this.bytes))
      : this.str
  }

  public asHex() {
    return this.hex === null ? (this.hex = toHex(this.bytes)) : this.hex
  }

  public asBytes() {
    return this.bytes
  }
}

const enc = (nBytes?: number): Encoder<Binary> => {
  const _enc = Bytes.enc(nBytes)
  return (value) => _enc(value.asBytes())
}

const dec = (nBytes?: number): Decoder<Binary> => {
  const _dec = Bytes.dec(nBytes)
  return (value) => new Binary(_dec(value))
}

export const Bin = (nBytes?: number): Codec<Binary> =>
  createCodec(enc(nBytes), dec(nBytes))

Bin.enc = enc
Bin.dec = dec
