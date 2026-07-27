import { Enum } from "@polkadot-api/substrate-bindings"
import { Primitive, type TerminalNode, type TypedefNode } from "./typedef"

// Descriptors: pallet + name => index (this._descriptors[opType][pallet][name])
// index will be for both checksums and compatLookup

type UnmatchedTypePayload = {
  expectedType: string
  actualType: string
}
export type IncompatibleResult = {
  compatible: false
  path: string
  reason: Enum<{
    UnmatchedType: UnmatchedTypePayload
    LengthMismatch: {
      expectedLength: number
      actualLength: number
    }
    MissingVariant: {
      availableVariants: string[]
      actualVariant: string
    }
    MissingKey: string
  }>
}
export type IsCompatibleResult =
  | {
      compatible: true
    }
  | IncompatibleResult
const compatible: IsCompatibleResult = {
  compatible: true,
}
const rootIncompatible = (
  reason: IncompatibleResult["reason"],
): IncompatibleResult => ({
  compatible: false,
  path: "",
  reason,
})

const prependPath = (pre: string, path: string) =>
  path ? `${pre}.${path}` : pre

// Dest type: describes types of the receiving end.
export function isCompatible(
  value: any,
  destNode: TypedefNode,
  getNode: (id: number) => TypedefNode,
): IsCompatibleResult {
  if (destNode.type === "option" && value == null) return compatible

  const nextCall = (value: any, destNode: TypedefNode, path: string) => {
    const result = isCompatible(value, destNode, getNode)
    return result.compatible
      ? result
      : {
          ...result,
          path: path ? prependPath(path, result.path) : result.path,
        }
  }

  const combineNextCalls = (
    calls: Array<{
      path: string
      value: any
      destNode: TypedefNode
      reasonMap?: (
        reason: IncompatibleResult["reason"],
      ) => IncompatibleResult["reason"]
    }>,
  ): IsCompatibleResult => {
    for (const {
      path,
      value,
      destNode,
      reasonMap = (v: IncompatibleResult["reason"]) => v,
    } of calls) {
      const innerRes = nextCall(value, destNode, path)
      if (innerRes.compatible) continue
      return {
        ...innerRes,
        reason: reasonMap(innerRes.reason),
      }
    }
    return compatible
  }

  const checkTerminal = (terminal: TerminalNode) => {
    switch (terminal.value.type) {
      case Primitive.str:
      case Primitive.big:
      case Primitive.bool:
      case Primitive.num:
        return {
          expectedType: terminal.value.type,
          actualType: typeof value,
        }
      case Primitive.bits: {
        const rawType = typeof value
        const actualType =
          value == null
            ? `null`
            : rawType !== "object" ||
                typeof value.bitsLen !== "number" ||
                !(value.bytes instanceof Uint8Array)
              ? rawType
              : "BitSequence"
        return {
          expectedType: "BitSequence",
          actualType,
        }
      }
      case Primitive.void:
        // A void node is always compatible, since the codec ignores the input.
        return {
          expectedType: "void",
          actualType: "void",
        }
    }
  }

  switch (destNode.type) {
    case "terminal": {
      const r = checkTerminal(destNode)
      return r.expectedType !== r.actualType
        ? rootIncompatible(Enum("UnmatchedType", r))
        : compatible
    }
    case "binary": {
      const actualType =
        typeof value === "object" && value instanceof Uint8Array
          ? ("Uint8Array" as const)
          : typeof value === "string" && value.startsWith("0x")
            ? ("HexString" as const)
            : typeof value
      const expectedType =
        destNode.value == undefined ? "Uint8Array" : "HexString"
      return actualType !== expectedType
        ? rootIncompatible(
            Enum("UnmatchedType", {
              actualType,
              expectedType,
            }),
          )
        : compatible
    }
    case "array":
      if (!Array.isArray(value))
        return rootIncompatible(
          Enum("UnmatchedType", {
            actualType: typeof value,
            expectedType: "Array",
          }),
        )
      const valueArr = value as Array<any>
      const expectedLength = destNode.value.length
      const actualLength = valueArr.length
      if (expectedLength != null && actualLength < expectedLength)
        return rootIncompatible(
          Enum("LengthMismatch", {
            actualLength,
            expectedLength,
          }),
        )
      return combineNextCalls(
        valueArr.slice(0, destNode.value.length).map((value, i) => ({
          destNode: getNode(destNode.value.typeRef),
          value,
          path: `${i}`,
        })),
      )
    case "enum":
      if (!value)
        return rootIncompatible(
          Enum("UnmatchedType", {
            actualType: typeof value,
            expectedType: "Enum",
          }),
        )
      const valueEnum = value as { type: string; value: any }
      const destVariants = Object.fromEntries(destNode.value)
      if (!(valueEnum.type in destVariants))
        return rootIncompatible(
          Enum("MissingVariant", {
            actualVariant: valueEnum.type,
            availableVariants: Object.keys(destVariants),
          }),
        )
      const variantValue = destVariants[valueEnum.type]
      if (variantValue == null) return compatible
      return nextCall(
        valueEnum.value,
        variantValue.type === "inline"
          ? variantValue.value
          : getNode(variantValue.value),
        "value",
      )
    case "option":
      if (value == null) return compatible
      return nextCall(value, getNode(destNode.value), "")
    case "struct":
      if (!value)
        return rootIncompatible(
          Enum("UnmatchedType", {
            actualType: typeof value,
            expectedType: "struct",
          }),
        )
      return combineNextCalls(
        destNode.value.map(([key, typeRef]) => ({
          destNode: getNode(typeRef),
          path: key,
          value: value[key],
          reasonMap: (r) => (key in value ? r : Enum("MissingKey", key)),
        })),
      )
    case "tuple":
      if (!value || !Array.isArray(value))
        return rootIncompatible(
          Enum("UnmatchedType", {
            actualType: typeof value,
            expectedType: `tuple len=${destNode.value.length}`,
          }),
        )
      // length will be checked indirectly - It's important as we might accept optionals
      return combineNextCalls(
        destNode.value.map((typeRef, idx) => ({
          destNode: getNode(typeRef),
          path: `${idx}`,
          value: value[idx],
          reasonMap: (r) =>
            value.length > idx
              ? r
              : Enum("LengthMismatch", {
                  actualLength: value.length,
                  expectedLength: destNode.value.length,
                }),
        })),
      )
    case "result":
      if (!("success" in value && "value" in value))
        return rootIncompatible(
          Enum("UnmatchedType", {
            actualType: typeof value,
            expectedType: "Result",
          }),
        )
      return nextCall(
        value.value,
        getNode(value.success ? destNode.value.ok : destNode.value.ko),
        value.success ? "valueOk" : "valueKo",
      )
  }
}
