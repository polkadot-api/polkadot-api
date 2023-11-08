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
  args: { value: StructDecoded; shape: Shape }
}

type WithInputAndMeta<T> = T & {
  input: HexString
  meta?: { path: string[]; docs: string }
}

export type VoidDecoded = WithInputAndMeta<{
  codec: "_void"
  value: undefined
}>

export type BoolDecoded = WithInputAndMeta<{
  codec: "bool"
  value: boolean
}>

export type StringDecoded = WithInputAndMeta<{
  codec: "str" | "char"
  value: string
}>

export type NumberDecoded = WithInputAndMeta<{
  codec: "u8" | "u16" | "u32" | "i8" | "i16" | "i32" | "compactNumber"
  value: number
}>

export type BigNumberDecoded = WithInputAndMeta<{
  codec: "u64" | "u128" | "u256" | "i64" | "i128" | "i256" | "compactBn"
  value: bigint
}>

export type BitSequenceDecoded = WithInputAndMeta<{
  codec: "bitSequence"
  value: {
    bitsLen: number
    bytes: Uint8Array
  }
}>

export type BytesSequenceDecoded = WithInputAndMeta<{
  codec: "Bytes"
  value: HexString
}>

export type BytesArrayDecoded = WithInputAndMeta<{
  codec: "BytesArray"
  value: HexString
  len: number
}>

export type AccountIdDecoded = WithInputAndMeta<{
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

export type SequenceDecoded = WithInputAndMeta<{
  codec: "Sequence"
  value: Array<Decoded>
}>

export type ArrayDecoded = WithInputAndMeta<{
  codec: "Array"
  value: Array<Decoded>
}>

export type TupleDecoded = WithInputAndMeta<{
  codec: "Tuple"
  value: Array<Decoded>
}>

export type StructDecoded = WithInputAndMeta<{
  codec: "Struct"
  value: StringRecord<Decoded>
}>

export type EnumDecoded = WithInputAndMeta<{
  codec: "Enum"
  value: {
    tag: string
    value: Decoded
  }
}>

export type ComplexDecoded =
  | SequenceDecoded
  | ArrayDecoded
  | TupleDecoded
  | StructDecoded
  | EnumDecoded

export type Decoded = PrimitiveDecoded | ComplexDecoded

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

// export declare const DecodedViewer = React.FC<Decoded>

// export declare const CallDecodedViewer = React.FC<{
//   pallet: {
//     value: { name: string; idx: number }
//     input: HexString
//   }
//   call: {
//     value: { name: string; idx: number }
//     input: HexString
//   }
//   args: StructDecoded
// }>
