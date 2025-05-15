import { MetadataLookup } from "@polkadot-api/metadata-builders"
import type {
  Decoder,
  HexString,
  ResultPayload,
  StringRecord,
  V14,
  V15,
  V16,
} from "@polkadot-api/substrate-bindings"

export type { Decoder, HexString, StringRecord, V14, V15, V16 }

export type UnshapedDecoder = {
  shape: Shape
  decoder: Decoder<Decoded>
}

type VariantBasedBuild = (
  pallet: string,
  name: string,
) => {
  view: UnshapedDecoder
  location: [number, number]
}

export type GetViewBuilder = (getLookupEntryDef: MetadataLookup) => {
  buildDefinition: (idx: number) => {
    shape: Shape
    decoder: Decoder<Decoded>
  }
  callDecoder: Decoder<DecodedCall>
  buildEvent: VariantBasedBuild
  buildError: VariantBasedBuild
  buildCall: VariantBasedBuild
  buildConstant: (pallet: string, name: string) => UnshapedDecoder
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
    docs: string[]
  }
  args: { value: StructDecoded; shape: Shape }
}

type WithInputAndPath<T> = T & {
  input: HexString
  path?: string[]
}

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

export type EthAccountDecoded = WithInputAndPath<{
  codec: "ethAccount"
  value: HexString
}>

export type BytesSequenceDecoded = WithInputAndPath<{
  codec: "Bytes"
  value: HexString
}>

export type BytesArrayDecoded = WithInputAndPath<{
  codec: "BytesArray"
  value: HexString
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
  | AccountIdDecoded
  | EthAccountDecoded

export type SequenceDecoded = WithInputAndPath<{
  codec: "Sequence"
  value: Array<Decoded>
}>

export type ArrayDecoded = WithInputAndPath<{
  codec: "Array"
  value: Array<Decoded>
}>

export type OptionDecoded = WithInputAndPath<{
  codec: "Option"
  value: Decoded
}>

export type ResultDecoded = WithInputAndPath<{
  codec: "Result"
  value: ResultPayload<Decoded, Decoded>
}>

export type TupleDecoded = WithInputAndPath<{
  codec: "Tuple"
  value: Array<Decoded>
  innerDocs: Array<string[]>
}>

export type StructDecoded = WithInputAndPath<{
  codec: "Struct"
  value: StringRecord<Decoded>
  innerDocs: StringRecord<string[]>
}>

export type EnumDecoded = WithInputAndPath<{
  codec: "Enum"
  value: {
    type: string
    value: Decoded
  }
  docs: string[]
}>

export type ComplexDecoded =
  | BytesArrayDecoded
  | SequenceDecoded
  | ArrayDecoded
  | TupleDecoded
  | StructDecoded
  | OptionDecoded
  | ResultDecoded
  | EnumDecoded

export type Decoded = PrimitiveDecoded | ComplexDecoded

export interface BytesArrayShape {
  codec: "BytesArray"
  len: number
}

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

export interface OptionShape {
  codec: "Option"
  shape: Shape
}

export interface ResultShape {
  codec: "Result"
  shape: { ok: Shape; ko: Shape }
}

export interface EnumShape {
  codec: "Enum"
  shape: StringRecord<Shape>
}

export type ComplexShape =
  | BytesArrayShape
  | SequenceShape
  | ArrayShape
  | TupleShape
  | StructShape
  | OptionShape
  | ResultShape
  | EnumShape

export type Shape = { codec: PrimitiveDecoded["codec"] } | ComplexShape
