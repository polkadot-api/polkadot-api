import {
  Struct as OStruct,
  Tuple as OTuple,
  Vector as OVector,
  Result as OResult,
  Option as OOption,
  Codec,
  Encoder,
  Decoder,
  StringRecord,
  CodecType,
  EncoderType,
  DecoderType,
  ResultPayload,
} from "scale-ts"

const withInner = <T, I>(codec: T, inner: I): T & { inner: I } => {
  const result: T & { inner: I } = codec as any
  result.inner = inner
  return result
}

export const Struct: {
  <A extends StringRecord<Codec<any>>>(
    codecs: A,
  ): Codec<{ [K in keyof A]: CodecType<A[K]> }> & { inner: A }
  enc: <A_1 extends StringRecord<Encoder<any>>>(
    encoders: A_1,
  ) => Encoder<{ [K_1 in keyof A_1]: EncoderType<A_1[K_1]> }> & { inner: A_1 }
  dec: <A_2 extends StringRecord<Decoder<any>>>(
    decoders: A_2,
  ) => Decoder<{ [K_2 in keyof A_2]: DecoderType<A_2[K_2]> }> & { inner: A_2 }
} = (codecs) => withInner(OStruct(codecs), codecs)
Struct.enc = (x) => withInner(OStruct.enc(x), x)
Struct.dec = (x) => withInner(OStruct.dec(x), x)

export const Tuple: {
  <A extends Codec<any>[]>(
    ...inner: A
  ): Codec<{ [K in keyof A]: A[K] extends Codec<infer D> ? D : unknown }> & {
    inner: A
  }
  enc: <A_1 extends Encoder<any>[]>(
    ...encoders: A_1
  ) => Encoder<{
    [K_1 in keyof A_1]: A_1[K_1] extends Encoder<infer D_1> ? D_1 : unknown
  }> & { inner: A_1 }
  dec: <A_2 extends Decoder<any>[]>(
    ...decoders: A_2
  ) => Decoder<{
    [K_2 in keyof A_2]: A_2[K_2] extends Decoder<infer D_2> ? D_2 : unknown
  }> & { inner: A_2 }
} = (...inner) => withInner(OTuple(...inner), inner)
Tuple.enc = (...iner) => withInner(OTuple.enc(...iner), iner)
Tuple.dec = (...iner) => withInner(OTuple.dec(...iner), iner)

export const Vector: {
  <T>(
    inner: Codec<T>,
    size?: number | undefined,
  ): Codec<T[]> & { inner: Codec<T> }
  enc: <T_1>(
    inner: Encoder<T_1>,
    size?: number | undefined,
  ) => Encoder<T_1[]> & { inner: Encoder<T_1> }
  dec: <T_2>(
    getter: Decoder<T_2>,
    size?: number | undefined,
  ) => Decoder<T_2[]> & { inner: Decoder<T_2> }
} = (inner, ...rest) => withInner(OVector(inner, ...rest), inner)
Vector.enc = (inner, ...rest) => withInner(OVector.enc(inner, ...rest), inner)
Vector.dec = (inner, ...rest) => withInner(OVector.dec(inner, ...rest), inner)

export const Result: {
  <OK, KO>(
    okCodec: Codec<OK>,
    koCodec: Codec<KO>,
  ): Codec<ResultPayload<OK, KO>> & { inner: { ok: Codec<OK>; ko: Codec<KO> } }
  dec: <OK_1, KO_1>(
    okDecoder: Decoder<OK_1>,
    koDecoder: Decoder<KO_1>,
  ) => Decoder<ResultPayload<OK_1, KO_1>> & {
    inner: { ok: Decoder<OK_1>; ko: Decoder<KO_1> }
  }
  enc: <OK_2, KO_2>(
    okEncoder: Encoder<OK_2>,
    koEncoder: Encoder<KO_2>,
  ) => Encoder<ResultPayload<OK_2, KO_2>> & {
    inner: { ok: Encoder<OK_2>; ko: Encoder<KO_2> }
  }
} = (ok, ko) => withInner(OResult(ok, ko), { ok, ko })
Result.enc = (ok, ko) => withInner(OResult.enc(ok, ko), { ok, ko })
Result.dec = (ok, ko) => withInner(OResult.dec(ok, ko), { ok, ko })

export const Option: {
  <T>(inner: Codec<T>): Codec<T | undefined> & { inner: Codec<T> }
  enc: <T_1>(
    inner: Encoder<T_1>,
  ) => Encoder<T_1 | undefined> & { inner: Encoder<T_1> }
  dec: <T_2>(
    inner: Decoder<T_2>,
  ) => Decoder<T_2 | undefined> & { inner: Decoder<T_2> }
} = (inner) => withInner(OOption(inner), inner)
Option.enc = (inner) => withInner(OOption.enc(inner), inner)
Option.dec = (inner) => withInner(OOption.dec(inner), inner)
