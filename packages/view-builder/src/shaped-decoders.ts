import { toHex as _toHex, mapStringRecord } from "@polkadot-api/utils"
import * as scale from "@polkadot-api/substrate-bindings"
import type {
  Decoder,
  HexString,
  StringRecord,
} from "@polkadot-api/substrate-bindings"
import type {
  ArrayDecoded,
  ArrayShape,
  BytesArrayDecoded,
  BytesArrayShape,
  ComplexDecoded,
  ComplexShape,
  Decoded,
  EnumDecoded,
  EnumShape,
  OptionDecoded,
  OptionShape,
  PrimitiveDecoded,
  ResultDecoded,
  ResultShape,
  SequenceDecoded,
  SequenceShape,
  StructDecoded,
  StructShape,
  TupleDecoded,
  TupleShape,
} from "./types"

const toHex = _toHex as (input: Uint8Array) => HexString

type Extras = "docs" | "path" | "innerDocs"
export type WithoutExtra<T extends {}> = Omit<T, Extras>
type PrimitiveCodec = PrimitiveDecoded["codec"]
type ComplexCodec = ComplexDecoded["codec"]

export type WithShapeWithoutExtra<T extends PrimitiveDecoded> = Decoder<
  WithoutExtra<T>
> & {
  shape: { codec: T["codec"] }
}
type PrimitiveShapeDecoder = WithShapeWithoutExtra<PrimitiveDecoded>

type BytesArrayShapedDecoder = Decoder<WithoutExtra<BytesArrayDecoded>> & {
  shape: BytesArrayShape
}

type SequenceShapedDecoder = Decoder<WithoutExtra<SequenceDecoded>> & {
  shape: SequenceShape
}
type ArrayShapedDecoder = Decoder<WithoutExtra<ArrayDecoded>> & {
  shape: ArrayShape
}
type TupleShapedDecoder = Decoder<WithoutExtra<TupleDecoded>> & {
  shape: TupleShape
}
type StructShapedDecoder = Decoder<WithoutExtra<StructDecoded>> & {
  shape: StructShape
}

type OptionShapedDecoder = Decoder<WithoutExtra<OptionDecoded>> & {
  shape: OptionShape
}

type ResultShapedDecoder = Decoder<WithoutExtra<ResultDecoded>> & {
  shape: ResultShape
}

type EnumShapedDecoder = Decoder<WithoutExtra<EnumDecoded>> & {
  shape: EnumShape
}
type ComplexShapedDecoder =
  | BytesArrayShapedDecoder
  | SequenceShapedDecoder
  | ArrayShapedDecoder
  | TupleShapedDecoder
  | StructShapedDecoder
  | OptionShapedDecoder
  | ResultShapedDecoder
  | EnumShapedDecoder

export type ShapedDecoder = PrimitiveShapeDecoder | ComplexShapedDecoder

type PrimitiveDecodedValue<C extends PrimitiveCodec> = (PrimitiveDecoded & {
  codec: C
})["value"]
type PrimitiveDecodedRest<C extends PrimitiveCodec> = Omit<
  PrimitiveDecoded & { codec: C },
  "value" | "input" | "codec" | Extras
>

type ComplexDecodedValue<C extends ComplexCodec> = (ComplexDecoded & {
  codec: C
})["value"]
type ComplexDecodedRest<C extends ComplexCodec> = Omit<
  ComplexDecoded & { codec: C },
  "value" | "input" | "codec" | Extras
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
): WithShapeWithoutExtra<
  PrimitiveDecoded & {
    codec: C
  }
> => {
  const decoder: Decoder<WithoutExtra<PrimitiveDecoded>> =
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
  WithoutExtra<
    ComplexDecoded & {
      codec: Shape["codec"]
    }
  >
> & {
  shape: Shape
} => {
  const decoder: Decoder<WithoutExtra<ComplexDecoded>> =
    createInputValueDecoder(input, { codec: shape.codec, ...rest })

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

const BytesArray = (len: number): BytesArrayShapedDecoder =>
  complexShapedDecoder({ codec: "BytesArray", len }, scale.Hex.dec(len), {
    len,
  })

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
  "ethAccount",
] as const

type PrimitivesList = typeof _primitives
type PrimitivesKeys = PrimitivesList[number]

const corePrimitives: {
  [P in PrimitivesKeys]: WithShapeWithoutExtra<
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
    scale.Variant.dec(input as {}, args as any),
  )

export const OptionDec = (input: ShapedDecoder): OptionShapedDecoder =>
  complexShapedDecoder(
    { codec: "Option", shape: input.shape },
    scale.Option.dec(input as any) as any,
  )

export const ResultDec = (
  ok: ShapedDecoder,
  ko: ShapedDecoder,
): ResultShapedDecoder =>
  complexShapedDecoder(
    { codec: "Result", shape: { ok: ok.shape, ko: ko.shape } },
    scale.Result.dec(ok as Decoder<any>, ko as Decoder<any>) as any,
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
  Option: OptionDec,
  Result: ResultDec,
}
