import * as scale from "@polkadot-api/substrate-bindings"
import { Hex, bool, char, fixedStr } from "@polkadot-api/substrate-bindings"
import { describe, it } from "vitest"
import {
  ArrayComponent,
  ArrayDecoded,
  BigNumberComponent,
  BigNumberDecoded,
  BoolComponent,
  BoolDecoded,
  Decoded,
  NumberComponent,
  NumberDecoded,
  StringComponent,
  StringDecoded,
} from "./view-builder-components"

const MockDecoded = {
  bool: (value: boolean): BoolDecoded => ({
    codec: "bool",
    value,
    input: Hex(1).dec(bool.enc(value)),
  }),
  int: (
    value: number,
    codec: NumberDecoded["codec"] = "u32",
  ): NumberDecoded => ({
    codec,
    value: Math.floor(value),
    input: Hex(Infinity).dec(scale[codec].enc(value)),
  }),
  bigInt: (
    value: bigint,
    codec: BigNumberDecoded["codec"] = "u128",
  ): BigNumberDecoded => ({
    codec,
    value: value,
    input: Hex(Infinity).dec(scale[codec].enc(value)),
  }),
  str: (value: string): StringDecoded => ({
    codec: "str",
    value,
    input: Hex(new Blob([value]).size).dec(
      fixedStr(new Blob([value]).size).enc(value),
    ),
  }),
  char: (value: string): StringDecoded => ({
    codec: "char",
    value,
    input: Hex(1).dec(char.enc(value)),
  }),
  array: (values: Decoded[]): ArrayDecoded => {
    if (values.length === 0)
      throw new Error("Array must have at least one value")

    return {
      codec: "Array",
      len: values.length,
      inner: values[0],
      value: values,
      input: "0xdummy" as scale.HexString, // probably need to reconstruct it from the inputs of the values
    }
  },
}

describe("view-builder-components", () => {
  describe("Primitives", () => {
    it("BoolComponent", () => {
      const rendered = BoolComponent(MockDecoded.bool(true))

      console.log(JSON.stringify(rendered))
    })

    it("StringComponent", () => {
      const rendered = StringComponent(MockDecoded.str("Hello World"))

      console.log(JSON.stringify(rendered))
    })

    it("NumberComponent", () => {
      const rendered = NumberComponent(MockDecoded.int(123))

      console.log(JSON.stringify(rendered))
    })

    it("NumberComponent", () => {
      const rendered = BigNumberComponent(
        MockDecoded.bigInt(BigInt(1234567890)),
      )

      console.log(JSON.stringify(rendered))
    })
  })

  describe("Complex", () => {
    it("ArrayComponent", () => {
      const decoded = MockDecoded.array(
        ["Hello", "World"].map((str) => MockDecoded.str(str)),
      )
      const rendered = ArrayComponent(decoded)

      console.log(JSON.stringify(rendered))
    })

    it("ArrayComponent nesting", () => {
      const decoded = MockDecoded.array([
        MockDecoded.array([1, 2].map((v) => MockDecoded.int(v))),
        MockDecoded.array([3, 4].map((v) => MockDecoded.int(v))),
      ])
      const rendered = ArrayComponent(decoded)

      console.log(JSON.stringify(rendered))
    })
  })
})
