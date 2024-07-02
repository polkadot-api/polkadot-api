import { Binary } from "@polkadot-api/substrate-bindings"
import type { TerminalNode, TypedefNode } from "./typedef"

// Descriptors: pallet + name => index (this._descriptors[opType][pallet][name])
// index will be for both checksums and compatLookup

// Dest type: describes types of the receiving end.
export function isCompatible(
  value: any,
  destNode: TypedefNode | null,
  getNode: (id: number) => TypedefNode | null,
): boolean {
  // A void node is always compatible
  if (!destNode) return true

  // Is this ok? This will cover for structs with optional keys
  if (destNode.type === "option" && value == undefined) {
    return true
  }

  const nextCall = (value: any, destNode: TypedefNode | null) =>
    isCompatible(value, destNode, getNode)

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
        .every((value) => nextCall(value, getNode(destNode.value)))
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
      return nextCall(value, getNode(destNode.value))
    case "struct":
      return Object.keys(destNode.values).every((key) =>
        nextCall(value[key], getNode(destNode.values[key])),
      )
    case "tuple":
      // length will be checked indirectly
      return destNode.values.every((idx) =>
        nextCall(value[idx], getNode(destNode.values[idx])),
      )
    case "result":
      if (!("success" in value && "value" in value)) return false
      return nextCall(
        value.value,
        getNode(value.success ? destNode.ok : destNode.ko),
      )
  }
}
