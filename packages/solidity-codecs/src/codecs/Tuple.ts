import { mergeUint8 } from "@unstoppablejs/utils"
import type { Codec, Decoder, Encoder } from "../types"
import { toInternalBytes, createCodec } from "../internal"
import { uint } from "./Uint"

const dynamicEnc = <
  A extends Array<Encoder<any>>,
  OT extends { [K in keyof A]: A[K] extends Encoder<infer D> ? D : unknown },
>(
  ...encoders: A
): Encoder<[...OT]> => {
  const res = ((values) => {
    const mapped = values.map((value, idx) => encoders[idx](value))
    const resultArray = new Array<Uint8Array>(encoders.length)
    const dinamics = []
    let len = 0n
    for (let i = 0; i < encoders.length; i++) {
      if (encoders[i].d) {
        dinamics.push(i)
        len += 32n
      } else {
        resultArray[i] = mapped[i]
        len += BigInt(mapped[i].length)
      }
    }

    dinamics.forEach((idx) => {
      resultArray[idx] = uint[0](len)
      const data = mapped[idx]
      resultArray.push(data)
      len += BigInt(data.length)
    })

    return mergeUint8(...resultArray)
  }) as Encoder<[...OT]>

  res.d = true
  return res
}

const staticEnc = <
  A extends Array<Encoder<any>>,
  OT extends { [K in keyof A]: A[K] extends Encoder<infer D> ? D : unknown },
>(
  ...encoders: A
) =>
  ((values) =>
    mergeUint8(...values.map((value, idx) => encoders[idx](value)))) as Encoder<
    [...OT]
  >

const staticDec = <
  A extends Array<Decoder<any>>,
  OT extends { [K in keyof A]: A[K] extends Decoder<infer D> ? D : unknown },
>(
  ...decoders: A
): Decoder<[...OT]> =>
  toInternalBytes(
    (bytes) => decoders.map((decoder) => decoder(bytes)) as [...OT],
  )
const dynamicDec = <
  A extends Array<Decoder<any>>,
  OT extends { [K in keyof A]: A[K] extends Decoder<infer D> ? D : unknown },
>(
  ...decoders: A
): Decoder<[...OT]> => {
  const res: Decoder<[...OT]> = toInternalBytes((bytes) => {
    const result = new Array(decoders.length) as [...OT]
    let start = bytes.i
    for (let i = 0; i < decoders.length; i++) {
      if (decoders[i].d) {
        const offset = Number(uint[1](bytes))
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
  res.d = true
  return res
}

export const Tuple = <
  A extends Array<Codec<any>>,
  OT extends { [K in keyof A]: A[K] extends Codec<infer D> ? D : unknown },
>(
  ...codecs: A
): Codec<[...OT]> => {
  const isDyn = codecs.some((c) => c.d)
  const [enc, dec] = isDyn
    ? ([dynamicEnc, dynamicDec] as const)
    : ([staticEnc, staticDec] as const)

  const res: Codec<[...OT]> = createCodec(
    enc(...codecs.map(([encoder]) => encoder)),
    dec(...codecs.map(([, decoder]) => decoder)),
    `(${codecs.map((c) => c.s).join(",")})`,
  )
  res.d = isDyn
  return res
}
