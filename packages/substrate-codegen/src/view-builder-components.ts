import type {
  Decoder,
  HexString,
  StringRecord,
  V14,
} from "@polkadot-api/substrate-bindings"

export type GetViewBuilder = (metadata: V14) => {
  buildDefinition: (idx: number) => {
    shape: Shape
    decoder: Decoder<Decoded>
  }
  callDecoder: Decoder<{
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
  }>
}

type WithInput<T> = T & { input: HexString }

export type VoidDecoded = WithInput<{
  codec: "_void"
  value: undefined
}>

export type BoolDecoded = WithInput<{
  codec: "bool"
  value: boolean
}>

export type StringDecoded = WithInput<{
  codec: "str" | "char"
  value: string
}>

export type NumberDecoded = WithInput<{
  codec: "u8" | "u16" | "u32" | "i8" | "i16" | "i32" | "compactNumber"
  value: number
}>

export type BigNumberDecoded = WithInput<{
  codec: "u64" | "u128" | "u256" | "i64" | "i128" | "i256" | "compactBn"
  value: bigint
}>

export type BitSequenceDecoded = WithInput<{
  codec: "bitSequence"
  value: {
    bitsLen: number
    bytes: Uint8Array
  }
}>

export type BytesDecoded = WithInput<{
  codec: "Bytes"
  value: Uint8Array
}>

export type AccountIdDecoded = WithInput<{
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
  | BytesDecoded
  | AccountIdDecoded

export interface SequenceShape {
  codec: "Sequence"
  inner: Shape
}

export interface ArrayShape {
  codec: "Array"
  len: number
  inner: Shape
}

export interface TupleShape {
  codec: "Tuple"
  inner: Array<Shape>
}

export interface StructShape {
  codec: "Struct"
  inner: StringRecord<Shape>
}

export interface EnumShape {
  codec: "Enum"
  inner: StringRecord<Shape>
}

export type ComplexShape =
  | SequenceShape
  | ArrayShape
  | TupleShape
  | StructShape
  | EnumShape

export type Shape = { codec: PrimitiveDecoded["codec"] } | ComplexShape

export interface SequenceDecoded extends WithInput<SequenceShape> {
  value: Array<Decoded>
}

export interface ArrayDecoded extends WithInput<ArrayShape> {
  value: Array<Decoded>
}

export interface TupleDecoded extends WithInput<TupleShape> {
  value: Array<Decoded>
}

export interface StructDecoded extends WithInput<StructShape> {
  value: StringRecord<Decoded>
}

export interface EnumDecoded extends WithInput<EnumShape> {
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

declare namespace React {
  type ReactNode = string
  type FC<T> = (props: T) => ReactNode
}

const DecodedComponent: React.FC<Decoded> = (props) => {
  switch (props.codec) {
    case "_void":
      return VoidComponent(props)
    case "bool":
      return BoolComponent(props)
    case "str":
    case "char":
      return StringComponent(props)
    case "u8":
    case "u16":
    case "u32":
    case "i8":
    case "i16":
    case "i32":
    case "compactNumber":
      return NumberComponent(props)
    case "u64":
    case "u128":
    case "u256":
    case "i64":
    case "i128":
    case "i256":
    case "compactBn":
      return BigNumberComponent(props)
    case "Array":
      return ArrayComponent(props)
    case "Sequence":
      return SequenceComponent(props)
    case "Tuple":
      return TupleComponent(props)
    default:
      throw `Not Implemented ${props.codec}`
  }
}

/**
 * Primitive Components
 */

const VoidComponent: React.FC<VoidDecoded> = (props) => {
  return `${props.codec}(${props.value})`
}

const BoolComponent: React.FC<BoolDecoded> = (props) => {
  return `${props.codec}(${props.value})`
}

const StringComponent: React.FC<StringDecoded> = (props) => {
  return `${props.codec}(${props.value})`
}

const NumberComponent: React.FC<NumberDecoded> = (props) => {
  return `${props.codec}(${props.value})`
}

const BigNumberComponent: React.FC<BigNumberDecoded> = (props) => {
  return `${props.codec}(${props.value})`
}

/**
 * Complex Components
 */

const ArrayComponent: React.FC<ArrayDecoded> = (props) => {
  return `${props.codec}([${props.value
    .map((v) => DecodedComponent(v))
    .join(", ")}])`
}

const SequenceComponent: React.FC<SequenceDecoded> = (props) => {
  return `${props.codec}([${props.value
    .map((v) => DecodedComponent(v))
    .join(", ")}])`
}

const TupleComponent: React.FC<TupleDecoded> = (props) => {
  return `${props.codec}([${props.value
    .map((v) => DecodedComponent(v))
    .join(", ")}])`
}

export {
  ArrayComponent,
  BigNumberComponent,
  BoolComponent,
  NumberComponent,
  StringComponent,
  VoidComponent,
  SequenceComponent,
  TupleComponent,
}
