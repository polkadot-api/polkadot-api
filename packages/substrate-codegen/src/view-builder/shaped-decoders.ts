import * as scale from "@polkadot-api/substrate-bindings"
import type {
  Decoder,
  HexString,
  StringRecord,
} from "@polkadot-api/substrate-bindings"
import {
  ArrayDecoded,
  ArrayShape,
  BytesArrayDecoded,
  ComplexDecoded,
  Decoded,
  EnumDecoded,
  EnumShape,
  PrimitiveDecoded,
  SequenceDecoded,
  SequenceShape,
  StructDecoded,
  StructShape,
  TupleDecoded,
  TupleShape,
} from "./types"

const toHex = scale.toHex as (input: Uint8Array) => HexString

export type WithoutPath<T extends { path: string[] }> = Omit<T, "path">
type PrimitiveCodec = PrimitiveDecoded["codec"]
type ComplexCodec = ComplexDecoded["codec"]
export type WithShapeWithoutPath<T extends PrimitiveDecoded> = Decoder<
  WithoutPath<T>
> & {
  shape: { codec: T["codec"] }
}
type PrimitiveShapeDecoder = WithShapeWithoutPath<PrimitiveDecoded>

type SequenceShapedDecoder = Decoder<WithoutPath<SequenceDecoded>> & {
  shape: SequenceShape
}
type ArrayShapedDecoder = Decoder<WithoutPath<ArrayDecoded>> & {
  shape: ArrayShape
}
type TupleShapedDecoder = Decoder<WithoutPath<TupleDecoded>> & {
  shape: TupleShape
}
type StructShapedDecoder = Decoder<WithoutPath<StructDecoded>> & {
  shape: StructShape
}
type EnumShapedDecoder = Decoder<WithoutPath<EnumDecoded>> & {
  shape: EnumShape
}
type ComplexShapedDecoder =
  | SequenceShapedDecoder
  | ArrayShapedDecoder
  | TupleShapedDecoder
  | StructShapedDecoder
  | EnumShapedDecoder

export type ShapedDecoder = PrimitiveShapeDecoder | ComplexShapedDecoder

type PrimitiveDecodedValue<C extends PrimitiveCodec> = (PrimitiveDecoded & {
  codec: C
})["value"]
type PrimitiveDecodedRest<C extends PrimitiveCodec> = Omit<
  PrimitiveDecoded & { codec: C },
  "value" | "input" | "codec" | "path"
>

type ComplexDecodedValue<C extends ComplexCodec> = (ComplexDecoded & {
  codec: C
})["value"]
type ComplexDecodedShape<C extends ComplexCodec> = (ComplexDecoded & {
  codec: C
})["shape"]
type ComplexDecodedRest<C extends ComplexCodec> = Omit<
  ComplexDecoded & { codec: C },
  "value" | "input" | "codec" | "path" | "shape"
>

const createInputValueDecoder = <T, Rest extends { codec: Decoded["codec"] }>(
  dec: Decoder<T>,
  rest: Rest,
): Decoder<
  Rest & {
    input: HexString
    value: T
  }
> =>
  scale.createDecoder((_bytes) => {
    const bytes = _bytes as Uint8Array & { i: number; v: DataView }
    const start = bytes.i
    const value = dec(bytes)
    const input = toHex(new Uint8Array(bytes.buffer.slice(start, bytes.i)))
    return { ...rest, value, input }
  })

const primitiveShapedDecoder = <C extends PrimitiveCodec>(
  codec: C,
  input: Decoder<PrimitiveDecodedValue<C>>,
  rest?: PrimitiveDecodedRest<C>,
): WithShapeWithoutPath<
  PrimitiveDecoded & {
    codec: C
  }
> => {
  const decoder: Decoder<WithoutPath<PrimitiveDecoded>> =
    createInputValueDecoder(input, { codec, ...rest })

  return Object.assign(decoder, {
    shape: { codec },
  }) as any
}

const complexShapedDecoder = <C extends ComplexCodec>(
  codec: C,
  input: Decoder<ComplexDecodedValue<C>>,
  innerShape: ComplexDecodedShape<C>,
  rest?: ComplexDecodedRest<C>,
): Decoder<
  WithoutPath<
    ComplexDecoded & {
      codec: C
    }
  >
> & {
  shape: { codec: C; shape: ComplexDecodedShape<C> } & ComplexDecodedRest<C>
} => {
  const decoder: Decoder<WithoutPath<ComplexDecoded>> = createInputValueDecoder(
    input,
    { codec, shape: innerShape, ...rest },
  )

  return Object.assign(decoder, {
    shape: {
      codec,
      shape: innerShape,
      ...rest,
    },
  }) as any
}

export const AccountIdShaped = (ss58Prefix = 42) => {
  const enhanced = scale.enhanceDecoder(
    scale.AccountId(ss58Prefix).dec,
    (address) => ({
      address,
      ss58Prefix,
    }),
  )

  return primitiveShapedDecoder("AccountId", enhanced, {})
}

const BytesArray = (len: number): WithShapeWithoutPath<BytesArrayDecoded> =>
  primitiveShapedDecoder("BytesArray", scale.Hex.dec(len), { len })

const _primitives = [
  "_void",
  "bool",
  "char",
  "str",
  "u8",
  "u16",
  "u32",
  "i8",
  "i16",
  "i32",
  "u64",
  "u128",
  "u256",
  "i64",
  "i128",
  "i256",
  "compactNumber",
  "compactBn",
  "bitSequence",
] as const

type PrimitivesList = typeof _primitives
type PrimitivesKeys = PrimitivesList[number]

const corePrimitives: {
  [P in PrimitivesKeys]: WithShapeWithoutPath<
    PrimitiveDecoded & {
      codec: P
    }
  >
} = Object.fromEntries(
  _primitives.map((x) => [x, primitiveShapedDecoder(x, scale[x].dec)]),
) as any

export const primitives = {
  ...corePrimitives,
  Bytes: primitiveShapedDecoder("Bytes", scale.Hex.dec()),
  BytesArray,
  AccountId: AccountIdShaped(),
}

const Sequence = (input: ShapedDecoder): SequenceShapedDecoder =>
  complexShapedDecoder("Sequence", scale.Vector.dec(input as any), input.shape)

const ArrayDec = (input: ShapedDecoder, len: number): ArrayShapedDecoder =>
  complexShapedDecoder(
    "Array",
    scale.Vector.dec(input as any, len),
    input.shape,
    {
      len,
    },
  )

const TupleDec = (...input: Array<ShapedDecoder>): TupleShapedDecoder =>
  complexShapedDecoder(
    "Tuple",
    scale.Tuple.dec(...(input as Array<Decoder<any>>)),
    input.map((x) => x.shape),
    {},
  )

const mapStringRecord = <I, O>(
  input: StringRecord<I>,
  mapper: (value: I, key: string) => O,
): StringRecord<O> =>
  Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key, mapper(value, key)]),
  ) as StringRecord<O>

const StructDec = (input: StringRecord<ShapedDecoder>): StructShapedDecoder =>
  complexShapedDecoder(
    "Struct",
    scale.Struct.dec(input as {}),
    mapStringRecord(input, (x) => x.shape),
  )

const EnumDec = (
  input: StringRecord<ShapedDecoder>,
  args?: number[],
): EnumShapedDecoder =>
  complexShapedDecoder(
    "Enum",
    scale.Enum.dec(input as {}, args as any),
    mapStringRecord(input, (x) => x.shape),
  )

export const selfDecoder = (value: () => ShapedDecoder): ShapedDecoder => {
  let cache: Decoder<any> = (x) => {
    const decoder = value()
    const result = decoder
    cache = decoder
    return result(x)
  }

  const result = ((x) => cache(x)) as ShapedDecoder
  result.shape = { codec: "_void" }
  return result
}

export const complex = {
  Sequence,
  Array: ArrayDec,
  Tuple: TupleDec,
  Struct: StructDec,
  Enum: EnumDec,
}
