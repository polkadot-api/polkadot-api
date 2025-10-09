import {
  Bytes,
  Codec,
  Decoder,
  Encoder,
  Tuple,
  compact,
  createCodec,
} from "scale-ts"
import { fromHex, mergeUint8, toHex } from "@polkadot-api/utils"
import { SS58String } from "@/utils"
import { AccountId } from "./AccountId"

type HexString = `0x${string}`

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

  asHex = () => (this.#hex ||= toHex(this.#bytes) as HexString)
  asOpaqueHex = () => (this.#opaqueHex ||= toHex(this.asBytes()) as HexString)

  asBytes = () => this.#bytes
  asOpaqueBytes = () =>
    (this.#opaqueBytes ||= mergeUint8([
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

const [accountIdEncoder] = AccountId()
export class FixedSizeBinary<_L extends number> extends Binary {
  constructor(data: Uint8Array) {
    super(data)
  }

  static fromArray<L extends number, I extends Array<number> & { length: L }>(
    input: I,
  ) {
    return new this<L>(new Uint8Array(input))
  }

  static fromAccountId32<L extends number>(
    input: L extends 32 ? SS58String : never,
  ) {
    return new this<L>(accountIdEncoder(input))
  }
}

const enc = (nBytes?: number): Encoder<Binary> => {
  const _enc = Bytes.enc(nBytes)
  return (value) => _enc(value.asBytes())
}

const dec = (nBytes?: number): Decoder<Binary> => {
  const _dec = Bytes.dec(nBytes)
  const Bin = nBytes == null ? Binary : FixedSizeBinary
  return (value) => Bin.fromBytes(_dec(value))
}

export const Bin = (nBytes?: number): Codec<Binary> =>
  createCodec(enc(nBytes), dec(nBytes))

Bin.enc = enc
Bin.dec = dec
