import { mergeUint8, toHex, utf16StrToUtf8Bytes } from "@unstoppablejs/utils"
import { Decoder, Encoder } from "@unstoppablejs/substrate-codecs"
import { Twox128 } from "./hashes"

export type EncoderWithHash<T> = [Encoder<T>, (input: Uint8Array) => Uint8Array]

export const Storage = (pallet: string) => {
  const palledEncoded = Twox128(utf16StrToUtf8Bytes(pallet))
  return <
    T,
    A extends Array<EncoderWithHash<any>>,
    OT extends {
      [K in keyof A]: A[K] extends EncoderWithHash<infer V> ? V : unknown
    },
  >(
    name: string,
    dec: Decoder<T>,
    ...encoders: [...A]
  ): {
    enc: (...args: OT) => string
    dec: Decoder<T>
  } => {
    const palletItemEncoded = mergeUint8(
      palledEncoded,
      Twox128(utf16StrToUtf8Bytes(name)),
    )
    const fns = encoders.map(
      ([enc, hash]) =>
        (val: any) =>
          hash(enc(val)),
    )

    const enc = (...args: OT): string =>
      toHex(
        mergeUint8(palletItemEncoded, ...args.map((val, idx) => fns[idx](val))),
      )

    return {
      enc,
      dec,
    }
  }
}
