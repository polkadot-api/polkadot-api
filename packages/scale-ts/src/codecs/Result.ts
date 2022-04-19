import { createCodec } from "../utils"
import { mergeUint8, toInternalBytes } from "../internal"
import { Decoder, Encoder, Codec } from "../types"
import { u8 } from "./fixed-width-ints"

type ResultPayload<OK, KO> =
  | { success: true; value: OK }
  | { success: false; value: KO }

const ResultDec = <OK, KO>(
  okDecoder: Decoder<OK>,
  koDecoder: Decoder<KO>,
): Decoder<ResultPayload<OK, KO>> =>
  toInternalBytes((bytes) => {
    const val = u8[1](bytes)
    const success = val === 0
    const decoder = success ? okDecoder : koDecoder
    const value = decoder(bytes)
    return { success, value } as ResultPayload<OK, KO>
  })

const ResultEnc =
  <OK, KO>(
    okEncoder: Encoder<OK>,
    koEncoder: Encoder<KO>,
  ): Encoder<ResultPayload<OK, KO>> =>
  ({ success, value }) =>
    mergeUint8(
      u8[0](success ? 0 : 1),
      (success ? okEncoder : koEncoder)(value as any),
    )

export const Result = <OK, KO>(
  okCodec: Codec<OK>,
  koCodec: Codec<KO>,
): Codec<ResultPayload<OK, KO>> =>
  createCodec(
    ResultEnc(okCodec[0], koCodec[0]),
    ResultDec(okCodec[1], koCodec[1]),
  )

Result.dec = ResultDec
Result.enc = ResultEnc
