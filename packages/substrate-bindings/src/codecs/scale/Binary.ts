import { fromHex, mergeUint8, toHex } from "@polkadot-api/utils"
import {
  Bytes,
  Codec,
  Decoder,
  Encoder,
  Tuple,
  compact,
  createCodec,
} from "scale-ts"
import type { HexString } from "./Hex"

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()
const opaqueBytesDec = Tuple(compact, Bytes(Infinity))[1]

export class Binary {
  #bytes: Uint8Array
  #opaqueBytes: Uint8Array | null = null
  #hex: HexString | null = null
  #opaqueHex: HexString | null = null
  #str: string | null = null

  constructor(data: Uint8Array, opaque = false) {
    if (opaque) {
      try {
        const [len, bytes] = opaqueBytesDec(data)
        if (len === bytes.length) {
          this.#bytes = bytes
          this.#opaqueBytes = data
          return
        }
      } catch (_) {}
      throw new Error("Invalid opaque bytes")
    } else this.#bytes = data
  }

  asText = () => (this.#str ??= textDecoder.decode(this.#bytes))

  asHex = () => (this.#hex ??= toHex(this.#bytes)) as `0x${string}`
  asOpaqueHex = () =>
    (this.#opaqueHex ??= toHex(this.asBytes())) as `0x${string}`

  asBytes = () => this.#bytes
  asOpaqueBytes = () =>
    (this.#opaqueBytes ??= mergeUint8([
      this.#bytes,
      compact[0](this.#bytes.length),
    ]))

  static fromText(input: string): Binary {
    return new this(textEncoder.encode(input))
  }

  static fromHex(input: HexString): Binary {
    return new this(fromHex(input))
  }
  static fromOpaqueHex(input: HexString): Binary {
    return new this(fromHex(input), true)
  }

  static fromBytes(input: Uint8Array): Binary {
    return new this(input)
  }
  static fromOpaqueBytes(input: Uint8Array): Binary {
    return new this(input, true)
  }
}

const enc = (nBytes?: number): Encoder<Binary> => {
  const _enc = Bytes.enc(nBytes)
  return (value) => _enc(value.asBytes())
}

const dec = (nBytes?: number): Decoder<Binary> => {
  const _dec = Bytes.dec(nBytes)
  return (value) => Binary.fromBytes(_dec(value))
}

export const Bin = (nBytes?: number): Codec<Binary> =>
  createCodec(enc(nBytes), dec(nBytes))

Bin.enc = enc
Bin.dec = dec
