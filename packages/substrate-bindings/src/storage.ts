import { mergeUint8, toHex, utf16StrToUtf8Bytes } from "@unstoppablejs/utils"
import { Decoder, Encoder } from "@unstoppablejs/substrate-codecs"
import { Twox128 } from "./hashes"
import type { SetReturnType } from "type-fest"

export type EncoderWithHash<T> = [Encoder<T>, (input: Uint8Array) => Uint8Array]
export type StorageCodec<OT, T> = {
  enc: SetReturnType<Encoder<OT>, string>
  dec: Decoder<T>
}

export const Storage = (pallet: string) => {
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
  ): StorageCodec<OT, T> => {
    const palletItemEncoded = mergeUint8(
      Twox128(utf16StrToUtf8Bytes(pallet)),
      Twox128(utf16StrToUtf8Bytes(name)),
    )
    const fns = encoders.map(
      ([enc, hash]) =>
        (val: any) =>
          hash(enc(val)),
    )

    return {
      enc: (...args) =>
        toHex(
          mergeUint8(
            palletItemEncoded,
            ...args.map((val, idx) => fns[idx](val)),
          ),
        ),
      dec,
    }
  }
}
