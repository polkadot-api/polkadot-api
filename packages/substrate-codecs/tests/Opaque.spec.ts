import { OpaqueCodec } from "@/Opaque"
import { randomBytes } from "@noble/hashes/utils"
import { bool, Bytes, enhanceCodec, str, Struct, u32 } from "scale-ts"
import { describe, expect, test } from "vitest"

describe("Opaque", () => {
  test("it correctly encodes/decodes its inputs", () => {
    const codec = Struct({
      a: u32,
      b: OpaqueCodec(
        Struct({
          foo: bool,
          bar: u32,
        }),
      ),
      c: str,
    })

    const encodedValue = codec.enc({
      a: 1714,
      b: {
        length: 5,
        inner: () => ({ foo: true, bar: 1899 }),
      },
      c: "hello there",
    })

    const decodedValue = codec.dec(encodedValue)

    expect(codec.enc(decodedValue)).toEqual(encodedValue)
  })

  test("it correctly encodes/decodes its inputs using `Bytes(Infinity)`", () => {
    const codec = Struct({
      a: u32,
      b: OpaqueCodec(Bytes(Infinity)),
      c: str,
    })

    const data = randomBytes(100)
    const encodedValue = codec.enc({
      a: 1714,
      b: {
        length: data.length,
        inner: () => data,
      },
      c: "hello there",
    })

    const decodedValue = codec.dec(encodedValue)

    expect(codec.enc(decodedValue)).toEqual(encodedValue)
  })

  test("it lazyly evaluates the decoded value", () => {
    let hasBeenEvaluated = false
    const _bool = enhanceCodec(
      bool,
      (x: boolean) => x,
      (x) => {
        hasBeenEvaluated = true
        return x
      },
    )

    const codec = Struct({
      a: u32,
      b: OpaqueCodec(
        Struct({
          foo: _bool,
          bar: u32,
        }),
      ),
      c: str,
    })

    const innerValue = { foo: true, bar: 1899 }
    const encodedValue = codec.enc({
      a: 1714,
      b: {
        length: 5,
        inner: () => innerValue,
      },
      c: "hello there",
    })

    const decodedValue = codec.dec(encodedValue)

    expect(hasBeenEvaluated).toBeFalsy()
    expect(decodedValue.b.inner()).toEqual(innerValue)
    expect(hasBeenEvaluated).toBeTruthy()
    expect(codec.enc(decodedValue)).toEqual(encodedValue)
  })
})
