import { Bin, Binary } from "@/."
import { describe, expect, test } from "vitest"

describe("Bin", () => {
  test("variable length - string", () => {
    const codec = Bin()

    const decodedText = "a$¢ह€한𐍈😃"
    const encodedText = "0x546124c2a2e0a4b9e282aced959cf0908d88f09f9883"

    const input = Binary.fromText(decodedText)
    const encoded = codec.enc(input)
    const decoded = codec.dec(encodedText)

    expect(encoded).toEqual(codec.enc(decoded))
    expect(input.asBytes()).toEqual(decoded.asBytes())
    expect(input.asText()).toEqual(decoded.asText())
    expect(input.asHex()).toEqual(decoded.asHex())
  })

  test("variable length - hex", () => {
    const codec = Bin()

    const input = Binary.fromHex("0x6124c2a2e0a4b9e282aced959cf0908d88f09f9883")

    const encoded = codec.enc(input)
    const decoded = codec.dec("0x546124c2a2e0a4b9e282aced959cf0908d88f09f9883")

    expect(encoded).toEqual(codec.enc(decoded))
    expect(input.asBytes()).toEqual(decoded.asBytes())
    expect(input.asText()).toEqual(decoded.asText())
    expect(input.asText()).toEqual("a$¢ह€한𐍈😃")
    expect(input.asHex()).toEqual(decoded.asHex())
  })

  test("Fixed length - text", () => {
    const codec = Bin(21)

    const decodedText = "a$¢ह€한𐍈😃"
    const encodedText = "0x6124c2a2e0a4b9e282aced959cf0908d88f09f9883"

    const input = Binary.fromText(decodedText)
    const encoded = codec.enc(input)
    const decoded = codec.dec(encodedText)

    expect(encoded).toEqual(codec.enc(decoded))
    expect(input.asBytes()).toEqual(decoded.asBytes())
    expect(input.asText()).toEqual(decoded.asText())
    expect(input.asHex()).toEqual(decoded.asHex())
  })

  test("Fixed length - hex", () => {
    const codec = Bin(21)

    const input = Binary.fromHex("0x6124c2a2e0a4b9e282aced959cf0908d88f09f9883")
    const encoded = codec.enc(input)
    const decoded = codec.dec("0x6124c2a2e0a4b9e282aced959cf0908d88f09f9883")

    expect(encoded).toEqual(codec.enc(decoded))
    expect(input.asBytes()).toEqual(decoded.asBytes())
    expect(input.asText()).toEqual(decoded.asText())
    expect(input.asText()).toEqual("a$¢ह€한𐍈😃")
    expect(input.asHex()).toEqual(decoded.asHex())
  })
})
