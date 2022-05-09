/* istanbul ignore file */

import { toHex } from "@unstoppablejs/utils"
import { Codec, Decoder, Encoder } from "../"

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
