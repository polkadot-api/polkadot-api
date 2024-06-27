import { Binary } from "@polkadot-api/substrate-bindings"
import { mapObject } from "@polkadot-api/utils"
import { MetadataPrimitives, Var } from "./lookups"

interface StructNode {
  type: "struct"
  values: {
    [key: string]: number
  }
}
interface TerminalNode {
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
interface EnumNode {
  type: "enum"
  variants: {
    [key: string]: TypedefNode | null
  }
}
interface TupleNode {
  type: "tuple"
  values: number[]
}
interface ArrayNode {
  type: "array"
  value: number
  length?: number
}
interface OptionNode {
  type: "option"
  value: number
}
interface ResultNode {
  type: "result"
  ok: number
  ko: number
}

type TypedefNode =
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

export function mapLookupToTypedef(entry: Var): TypedefNode | null {
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
            ? mapLookupToTypedef(params.value)
            : mapLookupToTypedef(params),
        ),
      }
    case "struct":
      return {
        type: "struct",
        values: mapObject(entry.value, (prop) => prop.id),
      }
    case "tuple":
      return {
        type: "tuple",
        values: entry.value.map((v) => v.id),
      }
    case "option":
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
      return {
        type: "array",
        value: entry.value.id,
      }
    case "void":
      return null
  }
}

// Descriptors: pallet + name => index (this._descriptors[opType][pallet][name])
// index will be for both checksums and compatLookup

// Dest type: describes types of the receiving end.
export function isCompatible(
  value: any,
  destNode: TypedefNode,
  destCompatLookup: TypedefNode[],
): boolean {
  // Is this ok? This will cover for structs with optional keys
  if (destNode.type === "option" && value == undefined) {
    return true
  }

  const nextCall = (value: any, destNode: TypedefNode) =>
    isCompatible(value, destNode, destCompatLookup)

  const checkTerminal = (terminal: TerminalNode) => {
    switch (terminal.value) {
      case "string":
        return typeof value === "string"
      case "bigint":
        return typeof value === "bigint"
      case "bitseq":
        return (
          typeof value === "object" &&
          value != null &&
          typeof value.bitsLen === "number" &&
          value.bytes instanceof Uint8Array
        )
      case "bool":
        return typeof value === "boolean"
      case "number":
        return typeof value === "number"
      case "numeric":
        return typeof value === "number" || typeof value === "bigint"
      case "binary":
        // TODO
        return value instanceof Uint8Array || value instanceof Binary
    }
  }

  switch (destNode.type) {
    case "terminal":
      return checkTerminal(destNode)
    case "array":
      const valueArr = value as Array<any>
      // TODO check passing an array with greater length sends in truncated to destNode.length
      if (destNode.length !== undefined && valueArr.length < destNode.length) {
        return false
      }
      return valueArr
        .slice(0, destNode.length)
        .every((value) => nextCall(value, destCompatLookup[destNode.value]))
    case "enum":
      const valueEnum = value as { type: string; value: any }
      if (!(valueEnum.type in destNode.variants)) {
        return false
      }
      const variantValue = destNode.variants[valueEnum.type]
      if (variantValue === null) {
        return true
      }
      return nextCall(valueEnum.value, variantValue)
    case "option":
      if (value == undefined) {
        return true
      }
      return nextCall(value, destCompatLookup[destNode.value])
    case "struct":
      return Object.keys(destNode.values).every((key) =>
        nextCall(value[key], destCompatLookup[destNode.values[key]]),
      )
    case "tuple":
      // length will be checked indirectly
      return destNode.values.every((idx) =>
        nextCall(value[idx], destCompatLookup[destNode.values[idx]]),
      )
    case "result":
      if (!("success" in value && "value" in value)) return false
      return nextCall(
        value.value,
        destCompatLookup[value.success ? destNode.ok : destNode.ko],
      )
  }
}
