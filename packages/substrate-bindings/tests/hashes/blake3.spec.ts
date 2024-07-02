import { fc, test } from "@fast-check/vitest"
import { expect } from "vitest"
import { mergeUint8 } from "@polkadot-api/utils"
import { Blake3256, Blake3256Concat } from "@/hashes/blake3"
import { blake3 } from "@noble/hashes/blake3"

test.prop([fc.uint8Array()])("Blake3256", (input) => {
  expect(Blake3256(input)).toStrictEqual(blake3(input, { dkLen: 32 }))
})

test.prop([fc.uint8Array()])("Blake3256Concat", (input) => {
  expect(Blake3256Concat(input)).toStrictEqual(
    mergeUint8(blake3(input, { dkLen: 32 }), input),
  )
})
