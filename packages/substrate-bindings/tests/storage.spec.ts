import { fc, it } from "@fast-check/vitest"
import { expect, describe, vi } from "vitest"
import { mergeUint8, toHex } from "@unstoppablejs/utils"
import { _void, str, u32 } from "@unstoppablejs/substrate-codecs"
import { EncoderWithHash } from "@/storage"

describe("storage", () => {
  it.prop([fc.uint8Array(), fc.string(), fc.string()])(
    "should only encode the palette item when no custom encoders are specified",
    async (hash, pallet, name) => {
      vi.doMock("@/hashes", () => ({
        Twox128: (_: Uint8Array) => hash,
      }))

      const { Storage } = await import(`@/storage?${Date.now()}`)

      const FooStorage = Storage(pallet)
      const FooBarStorage = FooStorage(name, _void.dec)

      const palletItemEncoded = toHex(mergeUint8(hash, hash))
      expect(FooBarStorage.enc()).toStrictEqual(palletItemEncoded)
    },
  )

  it.prop([
    fc.uint8Array(),
    fc.stringMatching(/^[1-9A-HJ-NP-Za-km-z]{47}$/),
    fc.integer({ min: 0 }),
  ])("should encode with custom encoders", async (hash, validator, era) => {
    vi.doMock("@/hashes", () => ({
      Twox128: (_: Uint8Array) => hash,
    }))

    const { Storage } = await import(`@/storage?${Date.now()}`)

    const FooStorage = Storage("foo")
    const barArgs: [EncoderWithHash<string>, EncoderWithHash<number>] = [
      [str.enc, (i) => i],
      [u32.enc, (i) => i],
    ]

    const FooBarStorage = FooStorage("bar", _void.dec, ...barArgs)
    const expected = toHex(
      mergeUint8(hash, hash, str.enc(validator), u32.enc(era)),
    )

    expect(FooBarStorage.enc(validator, era)).toStrictEqual(expected)
  })

  it.prop([fc.uint8Array(), fc.anything()])(
    "should use supplied decoder",
    async (input, anything) => {
      const { Storage } = await import("@/storage")
      const FooStorage = Storage("foo")
      const FooBarStorage = FooStorage("bar", (_) => anything)

      expect(FooBarStorage.dec(input)).toStrictEqual(anything)
    },
  )
})
