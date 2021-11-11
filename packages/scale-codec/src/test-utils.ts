import { toHex } from "@unstoppablejs/utils"
import { Codec } from "./"
import { Struct } from "./codecs/Struct"

export const testCodec = <T>(codec: Codec<T>) => {
  const Test = Struct({
    a: codec,
    b: codec,
    c: codec,
    d: codec,
    e: codec,
  })
  return (decoded: T, encoded: string) => {
    const reEncoded = "0x" + encoded.substr(2).repeat(5)
    const [encoder, decoder] = Test
    expect(
      toHex(
        encoder({ a: decoded, b: decoded, c: decoded, d: decoded, e: decoded }),
      ),
    ).toEqual(reEncoded)
    expect(decoder(reEncoded.substr(2))).toEqual({
      a: decoded,
      b: decoded,
      c: decoded,
      d: decoded,
      e: decoded,
    })
  }
}
