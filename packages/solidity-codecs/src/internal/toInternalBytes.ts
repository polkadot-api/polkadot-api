import { Decoder } from "../types"

// https://jsben.ch/URe1X
const HEX_MAP: Record<string, number> = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  a: 10,
  b: 11,
  c: 12,
  d: 13,
  e: 14,
  f: 15,
  A: 10,
  B: 11,
  C: 12,
  D: 13,
  E: 14,
  F: 15,
}
export function fromHex(hexString: string): Uint8Array {
  const isOdd = hexString.length % 2
  /* istanbul ignore next */
  const base = (hexString[1] === "x" ? 2 : 0) + isOdd
  const nBytes = (hexString.length - base) / 2 + isOdd
  const bytes = new Uint8Array(nBytes)

  if (isOdd) bytes[0] = 0 | HEX_MAP[hexString[2]]

  for (let i = 0; i < nBytes; ) {
    const idx = base + i * 2
    const a = HEX_MAP[hexString[idx]]
    const b = HEX_MAP[hexString[idx + 1]]
    bytes[isOdd + i++] = (a << 4) | b
  }

  return bytes
}

class InternalUint8Array extends Uint8Array {
  i: number = 0
  v: DataView

  constructor(buffer: ArrayBuffer) {
    super(buffer)
    this.v = new DataView(buffer)
  }
}

export const toInternalBytes =
  <T>(fn: (input: InternalUint8Array) => T): Decoder<T> =>
  (buffer: string | ArrayBuffer | Uint8Array | InternalUint8Array) =>
    fn(
      buffer instanceof InternalUint8Array
        ? buffer
        : new InternalUint8Array(
            buffer instanceof Uint8Array
              ? buffer.buffer
              : typeof buffer === "string"
              ? fromHex(buffer).buffer
              : buffer,
          ),
    )
