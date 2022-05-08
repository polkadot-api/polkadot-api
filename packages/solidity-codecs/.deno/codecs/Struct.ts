import { Codec, StringRecord } from "../types.ts"
import { enhanceCodec } from "../utils.ts"
import { Tuple } from "./Tuple.ts"

export const Struct = <
  A extends StringRecord<Codec<any>>,
  OT extends { [K in keyof A]: A[K] extends Codec<infer D> ? D : unknown },
>(
  codecs: A,
): Codec<OT> => {
  const keys = Object.keys(codecs)
  return enhanceCodec(
    Tuple(...Object.values(codecs)),
    (input: OT) => keys.map((k) => input[k]),
    (tuple: Array<any>) =>
      Object.fromEntries(tuple.map((value, idx) => [keys[idx], value])) as OT,
  )
}
