import {
  ArrayVar,
  NamedTupleVar,
  StructVar,
  TupleVar,
} from "@polkadot-api/metadata-builders"

type PrimitiveNode =
  | PrimitiveType
  | ChainPrimitiveType
  | FixedSizeBinary
  | InlineType
export type TypeNode =
  | PrimitiveNode
  | StructType
  | ArrayType
  | TupleType
  | NamedTupleType
  | ResultType
  | EnumType
  | UnionType
  | OptionType
export type LookupTypeNode = TypeNode & { id: number }
export type InlineType = {
  type: "inline"
  value: string
}
export type MaybeLookupNode = TypeNode | LookupTypeNode

export const isPrimitive = (node: TypeNode): node is PrimitiveNode =>
  ["chainPrimitive", "primitive", "fixedSizeBinary", "inline"].includes(
    node.type,
  )

export type NativeType =
  | "boolean"
  | "string"
  | "number"
  | "bigint"
  | "undefined"
  | "Uint8Array"
export type PrimitiveType = {
  type: "primitive"
  value: NativeType
}

export type ChainPrimitive = "HexString" | "SS58String" | "BitSequence"
export type ChainPrimitiveType = {
  type: "chainPrimitive"
  value: ChainPrimitive
}

export type FixedSizeBinary = {
  type: "fixedSizeBinary"
  value: number
}

// Need it as separate otherwise TS annoying with "maybe value is undefined even if it has the property!"
type WithOriginal<T, O> = T & ({} | { original: O })

export type StructType = WithOriginal<
  {
    type: "struct"
    value: Array<StructField>
  },
  StructVar
>

export type NamedTupleType = WithOriginal<
  {
    type: "namedTuple"
    value: Array<StructField>
  },
  NamedTupleVar
>

export type StructField = {
  label: string
  value: MaybeLookupNode
  docs: string[]
}

export type ArrayType = WithOriginal<
  {
    type: "array"
    value: {
      value: MaybeLookupNode
      len?: number
    }
  },
  ArrayVar
>

export type TupleType = WithOriginal<
  {
    type: "tuple"
    value: Array<TupleField>
  },
  TupleVar
>
export type TupleField = {
  value: MaybeLookupNode
  docs: string[]
}

export type ResultType = {
  type: "result"
  value: {
    ok: LookupTypeNode
    ko: LookupTypeNode
  }
}

export type EnumType = {
  type: "enum"
  value: Array<EnumVariant>
}
export type EnumVariant = {
  label: string
  docs: string[]
  value:
    | LookupTypeNode
    | TupleType
    | NamedTupleType
    | StructType
    | ArrayType
    | FixedSizeBinary
    | undefined
}

export type UnionType = {
  type: "union"
  value: MaybeLookupNode[]
}

export type OptionType = {
  type: "option"
  value: MaybeLookupNode
}
