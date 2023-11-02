import type {
  Decoder,
  HexString,
  StringRecord,
  V14,
} from "@polkadot-api/substrate-bindings"

export type { Decoder, HexString, StringRecord, V14 }

export type GetViewBuilder = (metadata: V14) => {
  buildDefinition: (idx: number) => {
    shape: Shape
    decoder: Decoder<Decoded>
  }
  callDecoder: Decoder<DecodedCall>
}

export interface DecodedCall {
  pallet: {
    value: {
      name: string
      idx: number
    }
    input: HexString
  }
  call: {
    value: {
      name: string
      idx: number
    }
    input: HexString
  }
  args: StructDecoded
}

type WithInputAndPath<T> = T & { input: HexString; path: string[] }

export type VoidDecoded = WithInputAndPath<{
  codec: "_void"
  value: undefined
}>

export type BoolDecoded = WithInputAndPath<{
  codec: "bool"
  value: boolean
}>

export type StringDecoded = WithInputAndPath<{
  codec: "str" | "char"
  value: string
}>

export type NumberDecoded = WithInputAndPath<{
  codec: "u8" | "u16" | "u32" | "i8" | "i16" | "i32" | "compactNumber"
  value: number
}>

export type BigNumberDecoded = WithInputAndPath<{
  codec: "u64" | "u128" | "u256" | "i64" | "i128" | "i256" | "compactBn"
  value: bigint
}>

export type BitSequenceDecoded = WithInputAndPath<{
  codec: "bitSequence"
  value: {
    bitsLen: number
    bytes: Uint8Array
  }
}>

export type BytesSequenceDecoded = WithInputAndPath<{
  codec: "Bytes"
  value: Uint8Array
}>

export type BytesArrayDecoded = WithInputAndPath<{
  codec: "BytesArray"
  value: Uint8Array
  len: number
}>

export type AccountIdDecoded = WithInputAndPath<{
  codec: "AccountId"
  value: {
    ss58Prefix: number
    address: string
  }
}>

export type PrimitiveDecoded =
  | VoidDecoded
  | BoolDecoded
  | StringDecoded
  | NumberDecoded
  | BigNumberDecoded
  | BitSequenceDecoded
  | BytesSequenceDecoded
  | BytesArrayDecoded
  | AccountIdDecoded

export interface SequenceShape {
  codec: "Sequence"
  shape: Shape
}

export interface ArrayShape {
  codec: "Array"
  len: number
  shape: Shape
}

export interface TupleShape {
  codec: "Tuple"
  shape: Array<Shape>
}

export interface StructShape {
  codec: "Struct"
  shape: StringRecord<Shape>
}

export interface EnumShape {
  codec: "Enum"
  shape: StringRecord<Shape>
}

export type ComplexShape =
  | SequenceShape
  | ArrayShape
  | TupleShape
  | StructShape
  | EnumShape

export type Shape = { codec: PrimitiveDecoded["codec"] } | ComplexShape

export interface SequenceDecoded extends WithInputAndPath<SequenceShape> {
  value: Array<Decoded>
}

export interface ArrayDecoded extends WithInputAndPath<ArrayShape> {
  value: Array<Decoded>
}

export interface TupleDecoded extends WithInputAndPath<TupleShape> {
  value: Array<Decoded>
}

export interface StructDecoded extends WithInputAndPath<StructShape> {
  value: StringRecord<Decoded>
}

export interface EnumDecoded extends WithInputAndPath<EnumShape> {
  value: {
    tag: string
    value: Decoded
  }
}

export type ComplexDecoded =
  | SequenceDecoded
  | ArrayDecoded
  | TupleDecoded
  | StructDecoded
  | EnumDecoded

export type Decoded = PrimitiveDecoded | ComplexDecoded
