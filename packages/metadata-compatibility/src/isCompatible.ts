import { Binary } from "@polkadot-api/substrate-bindings"
import { Primitive, type TerminalNode, type TypedefNode } from "./typedef"

// Descriptors: pallet + name => index (this._descriptors[opType][pallet][name])
// index will be for both checksums and compatLookup

// Dest type: describes types of the receiving end.
export function isCompatible(
  value: any,
  destNode: TypedefNode,
  getNode: (id: number) => TypedefNode,
): boolean {
  if (destNode.type === "option" && value == null) {
    return true
  }

  const nextCall = (value: any, destNode: TypedefNode) =>
    isCompatible(value, destNode, getNode)

  const checkTerminal = (terminal: TerminalNode) => {
    switch (terminal.value.type) {
      case Primitive.str:
      case Primitive.big:
      case Primitive.bool:
      case Primitive.num:
        return typeof value === terminal.value.type
      case Primitive.bits:
        return (
          typeof value === "object" &&
          value != null &&
          typeof value.bitsLen === "number" &&
          value.bytes instanceof Uint8Array
        )
      case Primitive.numeric:
        return typeof value === "number" || typeof value === "bigint"
      case Primitive.void:
        // A void node is always compatible, since the codec ignores the input.
        return true
    }
  }

  switch (destNode.type) {
    case "terminal":
      return checkTerminal(destNode)
    case "binary":
      return (
        value instanceof Binary &&
        (destNode.value == null || value.asBytes().length >= destNode.value)
      )
    case "array":
      if (!Array.isArray(value)) return false
      const valueArr = value as Array<any>
      if (
        destNode.value.length != null &&
        valueArr.length < destNode.value.length
      ) {
        return false
      }
      return valueArr
        .slice(0, destNode.value.length)
        .every((value) => nextCall(value, getNode(destNode.value.typeRef)))
    case "enum":
      if (!value) return false
      const valueEnum = value as { type: string; value: any }
      const destVariants = Object.fromEntries(destNode.value)
      if (!(valueEnum.type in destVariants)) {
        return false
      }
      const variantValue = destVariants[valueEnum.type]
      if (variantValue == null) {
        return true
      }
      return nextCall(valueEnum.value, variantValue)
    case "option":
      if (value == null) {
        return true
      }
      return nextCall(value, getNode(destNode.value))
    case "struct":
      if (!value) return false
      return destNode.value.every(([key, typeRef]) =>
        nextCall(value[key], getNode(typeRef)),
      )
    case "tuple":
      if (!value) return false
      // length will be checked indirectly
      return destNode.value.every((typeRef, idx) =>
        nextCall(value[idx], getNode(typeRef)),
      )
    case "result":
      if (!("success" in value && "value" in value)) return false
      return nextCall(
        value.value,
        getNode(value.success ? destNode.value.ok : destNode.value.ko),
      )
  }
}
