/* istanbul ignore file */

import { Codec, Decoder, Encoder } from "../index.ts"

// https://jsben.ch/uWZw3
const HEX_STR = "0123456789abcdef"
export function toHex(bytes: Uint8Array): string {
  const result = new Array<string>(bytes.length + 1)

  result[0] = "0x"

  for (let i = 0; i < bytes.length; ) {
    const b = bytes[i++]
    result[i] = HEX_STR[b >> 4] + HEX_STR[b & 15]
  }

  return result.join("")
}

export const testEncoder = <T>(encoder: Encoder<T>) => {
  return (decoded: T, encoded: string) => {
    expect(toHex(encoder(decoded))).toEqual(encoded)
  }
}

export const testDecoder = <T>(decoder: Decoder<T>) => {
  return (encoded: string, decoded: T) => {
    try {
      expect(decoder(encoded)).toEqual(decoded)
    } catch (e) {
      throw e
      /*
      expect((decoder(encoded) as any).toString()).toEqual(
        (decoded as any).toString(),
      )
      expect("something crashed on a toEqual expect").toBe("")
      */
    }
  }
}

export const testCodec = <T>(codec: Codec<T>) => {
  return (decoded: T, encoded: string) => {
    expect(toHex(codec.enc(decoded))).toEqual(encoded)

    try {
      expect(codec.dec(encoded)).toEqual(decoded)
    } catch (_) {
      expect((codec.dec(encoded) as any).toString()).toEqual(
        (decoded as any).toString(),
      )
      expect("something crashed on a toEqual expect").toBe("")
    }
  }
}
