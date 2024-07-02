import type { MetadataPrimitives, Var } from "@polkadot-api/metadata-builders"
import { mapObject } from "@polkadot-api/utils"

export interface StructNode {
  type: "struct"
  values: {
    [key: string]: number
  }
}
export interface TerminalNode {
  type: "terminal"
  value:
    | "bool"
    | "string"
    | "number"
    | "bigint"
    | "numeric"
    | "bitseq"
    | "binary"
}
export interface EnumNode {
  type: "enum"
  variants: {
    [key: string]: TypedefNode | null
  }
}
export interface TupleNode {
  type: "tuple"
  values: number[]
}
export interface ArrayNode {
  type: "array"
  value: number
  length?: number
}
export interface OptionNode {
  type: "option"
  value: number
}
export interface ResultNode {
  type: "result"
  ok: number
  ko: number
}

export type TypedefNode =
  | StructNode
  | TerminalNode
  | EnumNode
  | TupleNode
  | ArrayNode
  | OptionNode
  | ResultNode

const primitiveToTerminal: Record<MetadataPrimitives, TerminalNode["value"]> = {
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
        value: "string",
      }
    case "array":
      if (entry.value.type === "primitive" && entry.value.value === "u8") {
        return {
          type: "terminal",
          value: "binary",
        }
      }
      resolve(entry.value.id)
      return {
        type: "array",
        value: entry.value.id,
        length: entry.len,
      }
    case "bitSequence":
      return {
        type: "terminal",
        value: "bitseq",
      }
    case "compact":
      return {
        type: "terminal",
        value:
          entry.isBig === null ? "numeric" : entry.isBig ? "bigint" : "number",
      }
    case "enum":
      return {
        type: "enum",
        variants: mapObject(entry.value, (params) =>
          params.type === "lookupEntry"
            ? mapLookupToTypedef(params.value, resolve)
            : mapLookupToTypedef(params, resolve),
        ),
      }
    case "struct": {
      const values = mapObject(entry.value, (prop) => prop.id)
      Object.values(values).forEach(resolve)
      return {
        type: "struct",
        values,
      }
    }
    case "tuple": {
      const values = entry.value.map((v) => v.id)
      values.forEach(resolve)
      return {
        type: "tuple",
        values,
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
        value: primitiveToTerminal[entry.value],
      }
    case "result":
      resolve(entry.value.ok.id)
      resolve(entry.value.ko.id)
      return {
        type: "result",
        ok: entry.value.ok.id,
        ko: entry.value.ko.id,
      }
    case "sequence":
      if (entry.value.type === "primitive" && entry.value.value === "u8") {
        return {
          type: "terminal",
          value: "binary",
        }
      }
      resolve(entry.value.id)
      return {
        type: "array",
        value: entry.value.id,
      }
    case "void":
      return null
  }
}
