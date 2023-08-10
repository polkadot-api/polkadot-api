import { fc, it } from "@fast-check/vitest"
import { expect, describe } from "vitest"
import { char } from "@/."

describe("char", () => {
  it.prop([fc.char()])("should encode/decode chars", (input) => {
    const encoded = char.enc(input)
    expect(char.enc(input)).toStrictEqual(encoded)
    expect(char.dec(encoded)).toStrictEqual(input)
  })
})
