import { Codec, Struct } from "./"

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

export const testCodec = <T>(codec: Codec<T>) => {
  const Test = Struct({
    a: codec,
    b: codec,
    c: codec,
    d: codec,
    e: codec,
  })
  return (decoded: T, encoded: string) => {
    const reEncoded = "0x" + encoded.slice(2).repeat(5)
    expect(
      toHex(
        Test.enc({
          a: decoded,
          b: decoded,
          c: decoded,
          d: decoded,
          e: decoded,
        }),
      ),
    ).toEqual(reEncoded)

    try {
      expect(Test.dec(reEncoded)).toEqual({
        a: decoded,
        b: decoded,
        c: decoded,
        d: decoded,
        e: decoded,
      })
    } catch (_) {
      expect((codec.dec(encoded) as any).toString()).toEqual(
        (decoded as any).toString(),
      )
      expect("something crashed on a toEqual expect").toBe("")
    }
  }
}
