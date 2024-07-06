import type { MetadataPrimitives, Var } from "@polkadot-api/metadata-builders"
import {
  Codec,
  Option,
  Self,
  StringRecord,
  Struct,
  Tuple,
  Variant,
  Vector,
  _void,
  compact,
  str,
  type V14,
  type V15,
} from "@polkadot-api/substrate-bindings"

const smallCompact = compact as Codec<number>
export interface StructNode {
  type: "struct"
  value: Array<[string, number]>
}
const StructCodec = Vector(Tuple(str, smallCompact))

export const Primitive = {
  bool: "boolean" as const,
  str: "string" as const,
  num: "number" as const,
  big: "bigint" as const,
  numeric: "numeric" as const,
  bits: "bitseq" as const,
  bin: "binary" as const,
}
export type PRIMITIVES = (typeof Primitive)[keyof typeof Primitive]

export interface TerminalNode {
  type: "terminal"
  value: {
    type: PRIMITIVES
  }
}
const TerminalCodec = Variant(
  Object.fromEntries(
    Object.values(Primitive).map((p) => [p, _void]),
  ) as StringRecord<Codec<undefined>>,
) as any as Codec<TerminalNode["value"]>

export interface EnumNode {
  type: "enum"
  value: Array<[string, TypedefNode | undefined]>
}
const EnumCodec = Vector(Tuple(str, Option(Self(() => TypedefCodec))))

export interface TupleNode {
  type: "tuple"
  value: number[]
}
const TupleCodec = Vector(smallCompact)

export interface ArrayNode {
  type: "array"
  value: {
    typeRef: number
    length?: number
  }
}
const ArrayCodec = Struct({
  typeRef: smallCompact,
  length: Option(smallCompact),
}) as any as Codec<ArrayNode["value"]>

export interface OptionNode {
  type: "option"
  value: number
}
const OptionCodec = smallCompact

export interface ResultNode {
  type: "result"
  value: {
    ok: number
    ko: number
  }
}
const ResultCodec = Struct({
  ok: smallCompact,
  ko: smallCompact,
})

export type TypedefNode =
  | StructNode
  | TerminalNode
  | EnumNode
  | TupleNode
  | ArrayNode
  | OptionNode
  | ResultNode
export const TypedefCodec: Codec<TypedefNode> = Variant({
  struct: StructCodec,
  terminal: TerminalCodec,
  enum: EnumCodec,
  tuple: TupleCodec,
  array: ArrayCodec,
  option: OptionCodec,
  result: ResultCodec,
})

const primitiveToTerminal: Record<MetadataPrimitives, PRIMITIVES> = {
  i256: Primitive.big,
  i128: Primitive.big,
  i64: Primitive.big,
  i32: Primitive.num,
  i16: Primitive.num,
  i8: Primitive.num,
  u256: Primitive.big,
  u128: Primitive.big,
  u64: Primitive.big,
  u32: Primitive.num,
  u16: Primitive.num,
  u8: Primitive.num,
  bool: Primitive.bool,
  char: Primitive.str,
  str: Primitive.str,
}

const terminal = (type: PRIMITIVES): TerminalNode => ({
  type: "terminal",
  value: { type },
})
export function mapLookupToTypedef(
  entry: Var,
  resolve: (id: number) => void = () => {},
): TypedefNode | null {
  switch (entry.type) {
    case "AccountId20":
    case "AccountId32":
      return terminal(Primitive.str)
    case "array":
      if (entry.value.type === "primitive" && entry.value.value === "u8") {
        return terminal(Primitive.bin)
      }
      resolve(entry.value.id)
      return {
        type: "array",
        value: {
          typeRef: entry.value.id,
          length: entry.len,
        },
      }
    case "bitSequence":
      return terminal(Primitive.bits)
    case "compact":
      return terminal(
        entry.isBig === null
          ? Primitive.numeric
          : entry.isBig
            ? Primitive.big
            : Primitive.num,
      )
    case "enum":
      return {
        type: "enum",
        value: Object.entries(entry.value).map(([key, params]) => [
          key,
          (params.type === "lookupEntry"
            ? mapLookupToTypedef(params.value, resolve)
            : mapLookupToTypedef(params, resolve)) ?? undefined,
        ]),
      }
    case "struct": {
      const value = Object.entries(entry.value).map(
        ([key, prop]) => [key, prop.id] satisfies [string, number],
      )
      value.forEach(([, v]) => resolve(v))
      return {
        type: "struct",
        value,
      }
    }
    case "tuple": {
      const value = entry.value.map((v) => v.id)
      value.forEach(resolve)
      return {
        type: "tuple",
        value,
      }
    }
    case "option":
      resolve(entry.value.id)
      return {
        type: "option",
        value: entry.value.id,
      }
    case "primitive":
      return terminal(primitiveToTerminal[entry.value])
    case "result":
      resolve(entry.value.ok.id)
      resolve(entry.value.ko.id)
      return {
        type: "result",
        value: {
          ok: entry.value.ok.id,
          ko: entry.value.ko.id,
        },
      }
    case "sequence":
      if (entry.value.type === "primitive" && entry.value.value === "u8") {
        return terminal(Primitive.bin)
      }
      resolve(entry.value.id)
      return {
        type: "array",
        value: { typeRef: entry.value.id },
      }
    case "void":
      return null
  }
}

export function mapReferences(
  node: TypedefNode,
  mapFn: (id: number) => number,
): TypedefNode {
  switch (node.type) {
    case "array":
      return {
        ...node,
        value: {
          ...node.value,
          typeRef: mapFn(node.value.typeRef),
        },
      }
    case "option":
      return { ...node, value: mapFn(node.value) }
    case "result":
      return {
        ...node,
        value: { ok: mapFn(node.value.ok), ko: mapFn(node.value.ko) },
      }
    case "tuple":
      return { ...node, value: node.value.map(mapFn) }
    case "struct":
      return {
        ...node,
        value: node.value.map(([k, v]) => [k, mapFn(v)] as [string, number]),
      }
    case "enum":
      return {
        ...node,
        value: node.value.map(
          ([k, v]) =>
            [k, v == undefined ? undefined : mapReferences(v, mapFn)] as [
              string,
              TypedefNode | undefined,
            ],
        ),
      }
    case "terminal":
      return node
  }
}

export interface EntryPoint {
  args: number[]
  value?: number
}
export const EntryPointCodec = Struct({
  args: Vector(compact),
  value: Option(compact),
}) as Codec<EntryPoint>

export function storageEntryPoint(
  storageEntry: Exclude<
    (V15 | V14)["pallets"][number]["storage"],
    undefined
  >["items"][number],
): EntryPoint {
  if (storageEntry.type.tag === "plain")
    return {
      args: [],
      value: storageEntry.type.value,
    }

  const { key, value } = storageEntry.type.value
  return {
    args: [key],
    value,
  }
}

export function runtimeCallEntryPoint(
  entry: (V15 | V14)["apis"][number]["methods"][number],
): EntryPoint {
  return {
    args: entry.inputs.map((v) => v.type),
    value: entry.output,
  }
}
