import { fc, test } from "@fast-check/vitest"
import { expect } from "vitest"
import { mergeUint8 } from "@polkadot-api/utils"
import { Blake2128, Blake2256, Blake2128Concat } from "@/hashes/blake2"
import { blake2b } from "@noble/hashes/blake2b"

test.prop([fc.uint8Array()])("Blake2256", (input) => {
  expect(Blake2256(input)).toStrictEqual(blake2b(input, { dkLen: 32 }))
})

test.prop([fc.uint8Array()])("Blake2128", (input) => {
  expect(Blake2128(input)).toStrictEqual(blake2b(input, { dkLen: 16 }))
})

test.prop([fc.uint8Array()])("Blake2128Concat", (input) => {
  expect(Blake2128Concat(input)).toStrictEqual(
    mergeUint8([Blake2128(input), input]),
  )
})
