import { Codec, Decoder, Encoder } from "../types.ts"
import { uint } from "./uint.ts"
import { mergeUint8, toInternalBytes } from "../internal/index.ts"
import { createCodec } from "../utils.ts"

const uint256 = uint(256)
const callEnc =
  <
    A extends Array<Encoder<any>>,
    OT extends { [K in keyof A]: A[K] extends Encoder<infer D> ? D : unknown },
  >(
    ...encoders: A
  ): Encoder<[...OT]> =>
  (values) => {
    const mapped = values.map((value, idx) => encoders[idx](value))
    const resultArray = new Array<Uint8Array>(encoders.length)
    const dinamics = []
    let len = 0n
    for (let i = 0; i < encoders.length; i++) {
      if (encoders[i].din) {
        dinamics.push(i)
        len += 32n
      } else {
        resultArray[i] = mapped[i]
        len += BigInt(mapped[i].length)
      }
    }

    dinamics.forEach((idx) => {
      resultArray[idx] = uint256.enc(len)
      const data = mapped[idx]
      resultArray.push(data)
      len += BigInt(data.length)
    })

    return mergeUint8(...resultArray)
  }

const callDec = <
  A extends Array<Decoder<any>>,
  OT extends { [K in keyof A]: A[K] extends Decoder<infer D> ? D : unknown },
>(
  ...decoders: A
): Decoder<[...OT]> =>
  toInternalBytes((bytes) => {
    const result = new Array(decoders.length) as [...OT]
    let start = bytes.i
    for (let i = 0; i < decoders.length; i++) {
      if (decoders[i].din) {
        const offset = Number(uint256.dec(bytes))
        const current = bytes.i
        bytes.i = start + offset
        result[i] = decoders[i](bytes)
        bytes.i = current
      } else {
        result[i] = decoders[i](bytes)
      }
    }
    return result
  })

export const call = <
  A extends Array<Codec<any>>,
  OT extends { [K in keyof A]: A[K] extends Codec<infer D> ? D : unknown },
>(
  ...codecs: A
): Codec<[...OT]> =>
  createCodec(
    callEnc(...codecs.map(([encoder]) => encoder)),
    callDec(...codecs.map(([, decoder]) => decoder)),
  )

call.enc = callEnc
call.dec = callDec
