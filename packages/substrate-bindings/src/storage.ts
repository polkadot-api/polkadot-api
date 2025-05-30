import { fromHex, mergeUint8, toHex } from "@polkadot-api/utils"
import type { Codec } from "scale-ts"
import {
  Blake2128,
  Blake2128Concat,
  Blake2256,
  Identity,
  Twox128,
  Twox256,
  Twox64Concat,
} from "./hashes"

export type EncoderWithHash<T> = [Codec<T>, (input: Uint8Array) => Uint8Array]

const textEncoder = new TextEncoder()

// the value indicates:
// - when positive: the number of bytes to skip before reaching the transparent-encoded key
// - when negative: the number of bytes that the opaque hasher will generate
const hashers: Map<(input: Uint8Array) => Uint8Array, number> = new Map([
  [Identity, 0],
  [Twox64Concat, 8],
  [Blake2128Concat, 16],
  [Blake2128, -16],
  [Blake2256, -32],
  [Twox128, -16],
  [Twox256, -32],
])

export type OpaqueKeyHash = string & { __opaqueKeyHash?: unknown }

export const Storage = (pallet: string) => {
  const palledEncoded = Twox128(textEncoder.encode(pallet))
  return <A extends Array<EncoderWithHash<any>>>(
    name: string,
    ...encoders: [...A]
  ): {
    enc: (
      ...args: {
        [K in keyof A]: A[K] extends EncoderWithHash<infer V> ? V : unknown
      }
    ) => string
    dec: (value: string) => {
      [K in keyof A]: A[K] extends EncoderWithHash<infer V> ? V : unknown
    }
  } => {
    const palletItemEncoded = mergeUint8([
      palledEncoded,
      Twox128(textEncoder.encode(name)),
    ])

    const palletItemEncodedHex = toHex(palletItemEncoded)

    const dec = (
      key: string,
    ): {
      [K in keyof A]: A[K] extends EncoderWithHash<infer V> ? V : unknown
    } => {
      if (!key.startsWith(palletItemEncodedHex))
        throw new Error(`key does not match this storage (${pallet}.${name})`)

      if (encoders.length === 0) return [] as any

      const argsKey = fromHex(key.slice(palletItemEncodedHex.length))
      const result = new Array<any>(encoders.length)
      for (let i = 0, cur = 0; i < encoders.length; i++) {
        const [codec, hasher] = encoders[i]
        const hBytes = hashers.get(hasher)
        if (hBytes == null) throw new Error("Unknown hasher")
        if (hBytes < 0) {
          const opaqueBytes = hBytes * -1
          result[i] = toHex(argsKey.slice(cur, cur + opaqueBytes))
          cur += opaqueBytes
        } else {
          cur += hBytes
          result[i] = codec.dec(argsKey.slice(cur))
          cur += codec.enc(result[i]).length
        }
      }
      return result as any
    }

    const fns = encoders.map(
      ([{ enc }, hash]) =>
        (val: any) =>
          hash(enc(val)),
    )

    const enc = (
      ...args: {
        [K in keyof A]: A[K] extends EncoderWithHash<infer V> ? V : unknown
      }
    ): string =>
      toHex(
        mergeUint8([
          palletItemEncoded,
          ...args.map((val, idx) => fns[idx](val)),
        ]),
      )

    return {
      enc,
      dec,
    }
  }
}
