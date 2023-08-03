import { fc, test } from "@fast-check/vitest"
import { expect } from "vitest"
import { h64 } from "./h64"
import { xxhash64 } from "hash-wasm"
import { hexToBigint } from "bigint-conversion"

test.prop([fc.uint8Array()])("h64", async (input) => {
  const expectedOutput = await xxhash64(input).then(hexToBigint)
  expect(h64(input)).toStrictEqual(expectedOutput)
})
