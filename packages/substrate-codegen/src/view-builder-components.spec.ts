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
  SequenceComponent,
  SequenceDecoded,
  StringComponent,
  StringDecoded,
  TupleComponent,
  TupleDecoded,
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
  sequence: (values: Decoded[]): SequenceDecoded => ({
    codec: "Sequence",
    inner: values[0],
    value: values,
    input: "0xdummy" as scale.HexString, // probably need to reconstruct it from the inputs of the values
  }),
  tuple: (values: Decoded[]): TupleDecoded => ({
    codec: "Tuple",
    value: values,
    inner: values,
    input: "0xdummy" as scale.HexString,
  }),
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

    it("BigNumberComponent", () => {
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

    it("SequenceComponent", () => {
      const decoded = MockDecoded.sequence([
        MockDecoded.str("Hello"),
        MockDecoded.str("World"),
      ])

      const rendered = SequenceComponent(decoded)

      console.log(JSON.stringify(rendered))
    })

    it("TupleComponent", () => {
      const decoded = MockDecoded.tuple([
        MockDecoded.str("Hello"),
        MockDecoded.int(123),
        MockDecoded.bigInt(BigInt(1234567890)),
      ])

      const rendered = TupleComponent(decoded)

      console.log(JSON.stringify(rendered))
    })
  })

  describe("Nested", () => {
    it("ArrayComponent", () => {
      const decoded = MockDecoded.array([
        MockDecoded.array([1, 2].map((v) => MockDecoded.int(v))),
        MockDecoded.array([3, 4].map((v) => MockDecoded.int(v))),
      ])
      const rendered = ArrayComponent(decoded)

      console.log(JSON.stringify(rendered))
    })

    it("Sequence", () => {
      const decoded = MockDecoded.sequence([
        MockDecoded.sequence([1, 2].map((v) => MockDecoded.int(v))),
        MockDecoded.sequence([3, 4].map((v) => MockDecoded.int(v))),
      ])

      const rendered = SequenceComponent(decoded)

      console.log(JSON.stringify(rendered))
    })

    it("Tuple", () => {
      const decoded = MockDecoded.tuple([
        MockDecoded.tuple([1, 2].map((v) => MockDecoded.int(v))),
        MockDecoded.tuple(["hello", "world"].map((v) => MockDecoded.str(v))),
      ])

      const rendered = TupleComponent(decoded)

      console.log(JSON.stringify(rendered))
    })
  })
})
