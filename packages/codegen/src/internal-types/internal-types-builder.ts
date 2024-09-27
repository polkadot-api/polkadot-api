import {
  ArrayVar,
  EnumVar,
  LookupEntry,
  MetadataPrimitives,
  StructVar,
  TupleVar,
} from "@polkadot-api/metadata-builders"
import {
  ArrayType,
  EnumVariant,
  FixedSizeBinary,
  LookupTypeNode,
  NativeType,
  StructType,
  TupleType,
  TypeNode,
} from "./type-representation"
import { withCache } from "./with-cache"

export const primitiveTypes: Record<
  MetadataPrimitives | "compactNumber" | "compactBn",
  NativeType
> = {
  bool: "boolean",
  char: "string",
  str: "string",
  u8: "number",
  u16: "number",
  u32: "number",
  u64: "bigint",
  u128: "bigint",
  u256: "bigint",
  i8: "number",
  i16: "number",
  i32: "number",
  i64: "bigint",
  i128: "bigint",
  i256: "bigint",
  compactNumber: "number",
  compactBn: "bigint",
}

const buildType = withCache(
  (
    input: LookupEntry,
    cache: Map<number, LookupTypeNode>,
    stack: Set<number>,
  ): LookupTypeNode => {
    const buildNextType = (nextInput: LookupEntry) =>
      buildType(nextInput, cache, stack)

    const ltn = <T extends TypeNode["type"]>(
      type: T,
      value: (TypeNode & { type: T })["value"],
    ): LookupTypeNode =>
      ({
        id: input.id,
        type,
        value,
      }) as LookupTypeNode

    if (input.type === "primitive")
      return ltn("primitive", primitiveTypes[input.value])
    if (input.type === "void") return ltn("primitive", "undefined")
    if (input.type === "AccountId20") return ltn("chainPrimitive", "HexString")
    if (input.type === "AccountId32") return ltn("chainPrimitive", "SS58String")
    if (input.type === "compact") {
      const value: TypeNode[] = []
      if (!input.isBig) value.push({ type: "primitive", value: "number" })
      if (input.isBig || input.isBig === null)
        value.push({ type: "primitive", value: "bigint" })

      return ltn("union", value)
    }
    if (input.type === "bitSequence")
      return ltn("chainPrimitive", "BitSequence")

    if (
      input.type === "sequence" &&
      input.value.type === "primitive" &&
      input.value.value === "u8"
    )
      return ltn("chainPrimitive", "Binary")

    const buildArray = (array: ArrayVar): ArrayType | FixedSizeBinary => {
      const { value, len } = array
      if (value.type === "primitive" && value.value === "u8") {
        return { type: "fixedSizeBinary", value: len }
      }
      return {
        type: "array",
        value: { value: buildNextType(value), len },
        original: array,
      }
    }
    const buildTuple = (tuple: TupleVar): TupleType => {
      const { value, innerDocs } = tuple

      return {
        type: "tuple",
        value: value.map((v, i) => ({
          value: buildNextType(v),
          docs: innerDocs[i] ?? [],
        })),
        original: tuple,
      }
    }
    const buildStruct = (struct: StructVar): StructType => {
      const { value, innerDocs } = struct
      return {
        type: "struct",
        value: Object.entries(value).map(([label, value]) => ({
          label,
          docs: innerDocs[label] ?? [],
          value: buildNextType(value),
        })),
        original: struct,
      }
    }

    if (input.type === "array") return { id: input.id, ...buildArray(input) }
    if (input.type === "sequence")
      return ltn("array", { value: buildNextType(input.value) })
    if (input.type === "tuple") return { id: input.id, ...buildTuple(input) }
    if (input.type === "struct") return { id: input.id, ...buildStruct(input) }

    if (input.type === "option")
      return ltn("option", buildNextType(input.value))

    if (input.type === "result")
      return ltn("result", {
        ok: buildNextType(input.value.ok),
        ko: buildNextType(input.value.ko),
      })

    // it has to be an enum by now
    const buildInnerType = (
      value: EnumVar["value"][string],
    ):
      | LookupTypeNode
      | TupleType
      | StructType
      | ArrayType
      | FixedSizeBinary
      | undefined => {
      switch (value.type) {
        case "lookupEntry":
          return buildNextType(value.value)
        case "void":
          return undefined
        case "array":
          return buildArray(value)
        case "struct":
          return buildStruct(value)
        case "tuple":
          return buildTuple(value)
      }
    }

    const variants = Object.entries(input.value).map(
      ([label, value]): EnumVariant => ({
        docs: input.innerDocs[label] ?? [],
        label: label,
        value: buildInnerType(value),
      }),
    )
    return ltn("enum", variants)
  },
  (_, circular) => ({
    id: circular.id,
    optional: circular.type === "option",
    type: "primitive" as const,
    value: "undefined" as const,
  }),
  (result, tmp) => Object.assign(tmp, result),
)

export const getInternalTypesBuilder = (
  lookup: (id: number) => LookupEntry,
) => {
  const cache = new Map<number, LookupTypeNode>()

  return (id: number): LookupTypeNode => buildType(lookup(id), cache, new Set())
}
