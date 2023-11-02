import { toHex as _toHex, mapStringRecord } from "@polkadot-api/utils"
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
  ComplexShape,
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

const toHex = _toHex as (input: Uint8Array) => HexString

export type WithoutMeta<T extends { meta?: any }> = Omit<T, "meta">
type PrimitiveCodec = PrimitiveDecoded["codec"]
type ComplexCodec = ComplexDecoded["codec"]

export type WithShapeWithoutMeta<T extends PrimitiveDecoded> = Decoder<
  WithoutMeta<T>
> & {
  shape: { codec: T["codec"] }
}
type PrimitiveShapeDecoder = WithShapeWithoutMeta<PrimitiveDecoded>

type SequenceShapedDecoder = Decoder<WithoutMeta<SequenceDecoded>> & {
  shape: SequenceShape
}
type ArrayShapedDecoder = Decoder<WithoutMeta<ArrayDecoded>> & {
  shape: ArrayShape
}
type TupleShapedDecoder = Decoder<WithoutMeta<TupleDecoded>> & {
  shape: TupleShape
}
type StructShapedDecoder = Decoder<WithoutMeta<StructDecoded>> & {
  shape: StructShape
}
type EnumShapedDecoder = Decoder<WithoutMeta<EnumDecoded>> & {
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
  "value" | "input" | "codec" | "meta"
>

type ComplexDecodedValue<C extends ComplexCodec> = (ComplexDecoded & {
  codec: C
})["value"]
type ComplexDecodedRest<C extends ComplexCodec> = Omit<
  ComplexDecoded & { codec: C },
  "value" | "input" | "codec" | "meta"
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
): WithShapeWithoutMeta<
  PrimitiveDecoded & {
    codec: C
  }
> => {
  const decoder: Decoder<WithoutMeta<PrimitiveDecoded>> =
    createInputValueDecoder(input, { codec, ...rest })

  return Object.assign(decoder, {
    shape: { codec },
  }) as any
}

const complexShapedDecoder = <Shape extends ComplexShape>(
  shape: Shape,
  input: Decoder<ComplexDecodedValue<Shape["codec"]>>,
  rest?: ComplexDecodedRest<Shape["codec"]>,
): Decoder<
  WithoutMeta<
    ComplexDecoded & {
      codec: Shape["codec"]
    }
  >
> & {
  shape: Shape
} => {
  const decoder: Decoder<WithoutMeta<ComplexDecoded>> = createInputValueDecoder(
    input,
    { codec: shape.codec, ...rest },
  )

  return Object.assign(decoder, {
    shape,
  })
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

const BytesArray = (len: number): WithShapeWithoutMeta<BytesArrayDecoded> =>
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
  [P in PrimitivesKeys]: WithShapeWithoutMeta<
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
  complexShapedDecoder(
    { codec: "Sequence", shape: input.shape },
    scale.Vector.dec(input as any),
  )

const ArrayDec = (input: ShapedDecoder, len: number): ArrayShapedDecoder =>
  complexShapedDecoder(
    { codec: "Array", shape: input.shape, len },
    scale.Vector.dec(input as any, len),
  )

const TupleDec = (...input: Array<ShapedDecoder>): TupleShapedDecoder =>
  complexShapedDecoder(
    { codec: "Tuple", shape: input.map((x) => x.shape) },
    scale.Tuple.dec(...(input as Array<Decoder<any>>)),
  )

const StructDec = (input: StringRecord<ShapedDecoder>): StructShapedDecoder =>
  complexShapedDecoder(
    { codec: "Struct", shape: mapStringRecord(input, (x) => x.shape) },
    scale.Struct.dec(input as {}),
  )

const EnumDec = (
  input: StringRecord<ShapedDecoder>,
  args?: number[],
): EnumShapedDecoder =>
  complexShapedDecoder(
    { codec: "Enum", shape: mapStringRecord(input, (x) => x.shape) },
    scale.Enum.dec(input as {}, args as any),
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
