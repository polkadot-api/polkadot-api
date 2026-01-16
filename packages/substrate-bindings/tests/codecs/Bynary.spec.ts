import { Binary, Bytes } from "@/."
import { describe, expect, test } from "vitest"

describe("Bin", () => {
  test("variable length - string", () => {
    const codec = Bytes()

    const decodedText = "a$¢ह€한𐍈😃"
    const encodedText = "0x546124c2a2e0a4b9e282aced959cf0908d88f09f9883"

    const input = Binary.fromText(decodedText)
    const encoded = codec.enc(input)
    const decoded = codec.dec(encodedText)

    expect(encoded).toEqual(codec.enc(decoded))
    expect(input).toEqual(decoded)
    expect(Binary.toText(input)).toEqual(Binary.toText(decoded))
    expect(Binary.toHex(input)).toEqual(Binary.toHex(decoded))
  })

  test("variable length - hex", () => {
    const codec = Bytes()

    const input = Binary.fromHex("0x6124c2a2e0a4b9e282aced959cf0908d88f09f9883")

    const encoded = codec.enc(input)
    const decoded = codec.dec("0x546124c2a2e0a4b9e282aced959cf0908d88f09f9883")

    expect(encoded).toEqual(codec.enc(decoded))
    expect(input).toEqual(decoded)
    expect(Binary.toText(input)).toEqual(Binary.toText(decoded))
    expect(Binary.toText(input)).toEqual("a$¢ह€한𐍈😃")
    expect(Binary.toHex(input)).toEqual(Binary.toHex(decoded))
  })

  test("Fixed length - text", () => {
    const codec = Bytes(21)

    const decodedText = "a$¢ह€한𐍈😃"
    const encodedText = "0x6124c2a2e0a4b9e282aced959cf0908d88f09f9883"

    const input = Binary.fromText(decodedText)
    const encoded = codec.enc(input)
    const decoded = codec.dec(encodedText)

    expect(decoded).instanceOf(Uint8Array)
    expect(encoded).toEqual(codec.enc(decoded))
    expect(input).toEqual(decoded)
    expect(Binary.toText(input)).toEqual(Binary.toText(decoded))
    expect(Binary.toHex(input)).toEqual(Binary.toHex(decoded))
  })

  test("Fixed length - hex", () => {
    const codec = Bytes(21)

    const input = Binary.fromHex("0x6124c2a2e0a4b9e282aced959cf0908d88f09f9883")
    const encoded = codec.enc(input)
    const decoded = codec.dec("0x6124c2a2e0a4b9e282aced959cf0908d88f09f9883")

    expect(decoded).instanceOf(Uint8Array)
    expect(encoded).toEqual(codec.enc(decoded))
    expect(input).toEqual(decoded)
    expect(Binary.toText(input)).toEqual(Binary.toText(decoded))
    expect(Binary.toText(input)).toEqual("a$¢ह€한𐍈😃")
    expect(Binary.toHex(input)).toEqual(Binary.toHex(decoded))
  })
})
