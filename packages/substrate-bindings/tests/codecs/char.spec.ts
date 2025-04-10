import { fc, it } from "@fast-check/vitest"
import { expect, describe } from "vitest"
import { char } from "@/."

describe("char", () => {
  it.prop([fc.string({ minLength: 1, maxLength: 1 })])(
    "should encode/decode chars",
    (input) => {
      const encoded = char.enc(input)
      expect(char.enc(input)).toStrictEqual(encoded)
      expect(char.dec(encoded)).toStrictEqual(input)
    },
  )
})
