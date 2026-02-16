import { fromHex, mergeUint8, toHex } from "@polkadot-api/utils"
import { Bytes, Tuple, compact } from "scale-ts"
import type { HexString } from "./Hex"
import { compactNumber } from "./compact"

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()
const opaqueBytesDec = Tuple(compactNumber, Bytes(Infinity))[1]

export const Binary = {
  toText: (bytes: Uint8Array) => textDecoder.decode(bytes),
  toHex: (bytes: Uint8Array): HexString => toHex(bytes),
  toOpaque: (bytes: Uint8Array) =>
    mergeUint8([compact[0](bytes.length), bytes]),

  fromText: (text: string) => textEncoder.encode(text),
  fromHex: (hex: HexString) => fromHex(hex),
  fromOpaque: (opaque: Uint8Array | HexString) => {
    const data = typeof opaque === "string" ? fromHex(opaque) : opaque
    try {
      const [len, bytes] = opaqueBytesDec(data)
      if (len === bytes.length) {
        return bytes
      }
    } catch (_) {}
    throw new Error("Invalid opaque bytes")
  },
}
