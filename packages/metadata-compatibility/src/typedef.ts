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

export interface TerminalNode {
  type: "terminal"
  value: {
    type:
      | "bool"
      | "string"
      | "number"
      | "bigint"
      | "numeric"
      | "bitseq"
      | "binary"
  }
}
const TerminalCodec = Variant(
  Object.fromEntries(
    ["bool", "string", "number", "bigint", "numeric", "bitseq", "binary"].map(
      (p) => [p, _void],
    ),
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

const primitiveToTerminal: Record<
  MetadataPrimitives,
  TerminalNode["value"]["type"]
> = {
  i256: "bigint",
  i128: "bigint",
  i64: "bigint",
  i32: "number",
  i16: "number",
  i8: "number",
  u256: "bigint",
  u128: "bigint",
  u64: "bigint",
  u32: "number",
  u16: "number",
  u8: "number",
  bool: "bool",
  char: "string",
  str: "string",
}

export function mapLookupToTypedef(
  entry: Var,
  resolve: (id: number) => void = () => {},
): TypedefNode | null {
  switch (entry.type) {
    case "AccountId20":
    case "AccountId32":
      return {
        type: "terminal",
        value: { type: "string" },
      }
    case "array":
      if (entry.value.type === "primitive" && entry.value.value === "u8") {
        return {
          type: "terminal",
          value: { type: "binary" },
        }
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
      return {
        type: "terminal",
        value: { type: "bitseq" },
      }
    case "compact":
      return {
        type: "terminal",
        value: {
          type:
            entry.isBig === null
              ? "numeric"
              : entry.isBig
                ? "bigint"
                : "number",
        },
      }
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
      return {
        type: "terminal",
        value: { type: primitiveToTerminal[entry.value] },
      }
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
        return {
          type: "terminal",
          value: { type: "binary" },
        }
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

export interface EntryPoint {
  type: "entryPoint"
  args: number[]
  value: number
}

export function storageEntryPoint(
  storageEntry: Exclude<
    (V15 | V14)["pallets"][number]["storage"],
    undefined
  >["items"][number],
): EntryPoint {
  if (storageEntry.type.tag === "plain")
    return {
      type: "entryPoint",
      args: [],
      value: storageEntry.type.value,
    }

  const { key, value } = storageEntry.type.value
  return {
    type: "entryPoint",
    args: [key],
    value,
  }
}

export function runtimeCallEntryPoint(
  entry: (V15 | V14)["apis"][number]["methods"][number],
): EntryPoint {
  return {
    type: "entryPoint",
    args: entry.inputs.map((v) => v.type),
    value: entry.output,
  }
}
