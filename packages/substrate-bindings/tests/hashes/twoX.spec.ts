import { fc, test } from "@fast-check/vitest"
import { u64 } from "@/."
import { mergeUint8 } from "@polkadot-api/utils"
import { expect, vi } from "vitest"

function setBytes(bytes: bigint[], out: Uint8Array) {
  const dv = new DataView(out.buffer)

  for (let i = 0; i < bytes.length; i++) {
    dv.setBigUint64(8 * i, bytes[i], true)
  }
}

const bigU64 = () => fc.bigInt({ min: 0n, max: (1n << 63n) - 1n })

test.prop([fc.uint8Array(), fc.tuple(bigU64(), bigU64())])(
  "Twox128",
  async (input, bytes) => {
    let count = 0
    vi.doMock("@/hashes/h64", () => ({
      h64: (_: Uint8Array) => bytes[count++],
    }))

    const { Twox128 } = await import(
      /* @vite-ignore */ `../../src/hashes/twoX?${Date.now()}`
    )

    const expected = new Uint8Array(16)
    setBytes(bytes, expected)

    expect(Twox128(input)).toStrictEqual(expected)
  },
)

test.prop([fc.uint8Array(), fc.tuple(bigU64(), bigU64(), bigU64(), bigU64())])(
  "Twox256",
  async (input, bytes) => {
    let count = 0
    vi.doMock("@/hashes/h64", () => ({
      h64: (_: Uint8Array) => bytes[count++],
    }))

    const { Twox256 } = await import(
      /* @vite-ignore */ `../../src/hashes/twoX?${Date.now()}`
    )

    const expected = new Uint8Array(32)
    setBytes(bytes, expected)

    expect(Twox256(input)).toStrictEqual(expected)
  },
)

test.prop([fc.uint8Array(), bigU64()])("Twox64Concat", async (input, hash) => {
  vi.doMock("@/hashes/h64", () => ({
    h64: (_: Uint8Array) => hash,
  }))

  const { Twox64Concat } = await import(
    /* @vite-ignore */ `../../src/hashes/twoX?${Date.now()}`
  )

  const expected = mergeUint8([u64.enc(hash), input])

  expect(Twox64Concat(input)).toStrictEqual(expected)
})
