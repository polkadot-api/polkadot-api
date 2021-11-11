import { createCodec, toBuffer } from "../utils"
import { Decoder, Encoder, Codec } from "../types"
import { U8Enc, U8Dec } from "./U8"
import { mergeUint8 } from "@unstoppablejs/utils"

type ResultPayload<OK, KO> =
  | { success: true; value: OK }
  | { success: false; value: KO }

export const ResultDec = <OK, KO>(
  okDecoder: Decoder<OK>,
  koDecoder: Decoder<KO>,
): Decoder<ResultPayload<OK, KO>> =>
  toBuffer((buffer) => {
    const val = U8Dec(buffer)
    const success = val === 0
    const decoder = success ? okDecoder : koDecoder
    const value = decoder(buffer)
    return { success, value } as ResultPayload<OK, KO>
  })

export const ResultEnc =
  <OK, KO>(
    okEncoder: Encoder<OK>,
    koEncoder: Encoder<KO>,
  ): Encoder<ResultPayload<OK, KO>> =>
  ({ success, value }) =>
    mergeUint8(
      U8Enc(success ? 0 : 1),
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
