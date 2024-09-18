import {
  EnumVar,
  LookupEntry,
  MetadataPrimitives,
} from "@polkadot-api/metadata-builders"
import {
  ArrayType,
  EnumVariant,
  LookupTypeNode,
  NativeType,
  StructType,
  TupleType,
  TypeNode,
} from "./type-representation"
import { withCache } from "./with-cache"
import { StringRecord } from "@polkadot-api/substrate-bindings"

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

    const buildArray = (inner: LookupEntry, len: number) => {
      if (inner.type === "primitive" && inner.value === "u8") {
        return ltn("fixedSizeBinary", len)
      }
      return ltn("array", { value: buildNextType(inner), len })
    }
    const buildTuple = (value: LookupEntry[], docs: string[][]) =>
      ltn(
        "tuple",
        value.map((v, i) => ({
          value: buildNextType(v),
          docs: docs[i],
        })),
      )
    const buildStruct = (
      value: StringRecord<LookupEntry>,
      docs: StringRecord<string[]>,
    ) =>
      ltn(
        "struct",
        Object.entries(value).map(([label, value]) => ({
          label,
          docs: docs[label],
          value: buildNextType(value),
        })),
      )

    if (input.type === "array") return buildArray(input.value, input.len)
    if (input.type === "sequence")
      return ltn("array", { value: buildNextType(input.value) })
    if (input.type === "tuple") return buildTuple(input.value, input.innerDocs)
    if (input.type === "struct")
      return buildStruct(input.value, input.innerDocs)

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
    ): LookupTypeNode | TupleType | StructType | ArrayType | undefined => {
      switch (value.type) {
        case "lookupEntry":
          return buildNextType(value.value)
        case "void":
          return undefined
        case "array":
          return buildArray(value.value, value.len)
        case "struct":
          return buildStruct(value.value, value.innerDocs)
        case "tuple":
          return buildTuple(value.value, value.innerDocs)
      }
    }

    const variants = Object.entries(input.value).map(
      ([label, value]): EnumVariant => ({
        docs: input.innerDocs[label],
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
