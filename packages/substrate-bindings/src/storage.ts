import { mergeUint8, toHex } from "@polkadot-api/utils"
import { Codec, Decoder } from "scale-ts"
import { Blake2128Concat, Identity, Twox128, Twox64Concat } from "./hashes"

export type EncoderWithHash<T> = [Codec<T>, (input: Uint8Array) => Uint8Array]

const textEncoder = new TextEncoder()

export const Storage = (pallet: string) => {
  const palledEncoded = Twox128(textEncoder.encode(pallet))
  return <T, A extends Array<EncoderWithHash<any>>>(
    name: string,
    dec: Decoder<T>,
    ...encoders: [...A]
  ): {
    enc: (
      ...args: {
        [K in keyof A]: A[K] extends EncoderWithHash<infer V> ? V : unknown
      }
    ) => string
    dec: Decoder<T>
    keyDecoder: (value: string) => {
      [K in keyof A]: A[K] extends EncoderWithHash<infer V> ? V : unknown
    }
  } => {
    const palletItemEncoded = mergeUint8(
      palledEncoded,
      Twox128(textEncoder.encode(name)),
    )

    const palletItemEncodedHex = toHex(palletItemEncoded)
    const bytesToSkip = encoders
      .map((e) => e[1])
      .map((x) => {
        if (x === Identity) return 0
        if (x === Twox64Concat) return 8
        if (x === Blake2128Concat) return 16
        return null
      })
      .filter(Boolean) as Array<number>

    const keyDecoder = (
      key: string,
    ): {
      [K in keyof A]: A[K] extends EncoderWithHash<infer V> ? V : unknown
    } => {
      if (!key.startsWith(palletItemEncodedHex))
        throw new Error(`key does not match this storage (${pallet}.${name})`)

      if (bytesToSkip.length !== encoders.length)
        throw new Error("Impossible to decode this key")

      if (encoders.length === 0) return [] as any

      const argsKey = key.slice(palletItemEncodedHex.length)
      const result = new Array<any>(encoders.length)
      for (let i = 0, cur = 0; i < bytesToSkip.length; i++) {
        const codec = encoders[i][0]
        cur += bytesToSkip[i]
        result[i] = codec.dec(argsKey.slice(cur * 2))
        cur += codec.enc(result[i]).length
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
        mergeUint8(palletItemEncoded, ...args.map((val, idx) => fns[idx](val))),
      )

    return {
      enc,
      dec,
      keyDecoder,
    }
  }
}
