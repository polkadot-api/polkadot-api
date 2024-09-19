import {
  EnumVariant,
  LookupTypeNode,
  StructField,
  TypeNode,
} from "./type-representation"

export type NodeCodeGenerator = (
  innerNode: TypeNode | LookupTypeNode,
  next: (node: TypeNode) => string,
) => string

/**
 * This function is chain-type agnostic. It will try its best to generate all
 * types, but will fail for non-native types (e.g. Binary)
 * This can be enhanced through composition.
 */
export const nativeNodeCodegen: NodeCodeGenerator = (node, next) => {
  if (node.type === "primitive") return node.value
  if (node.type === "chainPrimitive")
    throw new Error("Can't generate chain primitive type " + node.value)
  if (
    node.type === "result" ||
    node.type === "enum" ||
    node.type === "fixedSizeBinary"
  )
    throw new Error("Can't generate chain primitive type " + node.type)
  if (node.type === "array") return `Array<${next(node.value.value)}>`

  if (node.type === "struct") {
    return generateObjectCode(node.value, (value) => next(value))
  }
  if (node.type === "tuple") {
    // docs seem to have no effect on tuples (VSCode)
    return `[${node.value.map(({ value }) => next(value)).join(", ")}]`
  }
  if (node.type === "union")
    return node.value.map((v) => `(${next(v)})`).join(" | ")

  // Must be an option
  return `(${next(node.value)}) | undefined`
}

export function generateTypescript(
  node: TypeNode,
  getNodeCode: NodeCodeGenerator,
): string {
  const next = (node: TypeNode) => getNodeCode(node, next)
  return next(node)
}

export function processPapiPrimitives(
  node: TypeNode,
  getCode: (node: TypeNode) => string,
): { code: string; import?: string } | null {
  if (node.type === "chainPrimitive") {
    return node.value === "BitSequence"
      ? { code: `{bytes: Uint8Array, bitsLen: number}` }
      : {
          code: node.value,
          import: node.value,
        }
  }

  if (node.type === "result") {
    return {
      code: `ResultPayload<${getCode(node.value.ok)}, ${getCode(node.value.ok)}>`,
      import: `ResultPayload`,
    }
  }

  if (node.type === "enum") {
    const innerCode = generateObjectCode(node.value, getCode)

    return {
      code: `Enum<${innerCode}>`,
      import: `Enum`,
    }
  }

  if (node.type === "fixedSizeBinary") {
    return {
      code: `FixedSizeBinary<${node.value}>`,
      import: "FixedSizeBinary",
    }
  }

  if (node.type === "array" && node.value.len) {
    return {
      code: `FixedSizeArray<${node.value.len}, ${getCode(node.value.value)}>`,
      import: "FixedSizeArray",
    }
  }

  return null
}

export const generateObjectCode = (
  fields: (StructField | EnumVariant)[],
  next: (node: TypeNode) => string,
) =>
  `{${fields
    .map(({ label, value, docs }) => {
      if (!docs) {
        console.log(fields)
      }

      const docsPrefix = docs.length
        ? `\n/**\n${docs.map((doc) => ` *${doc}`).join("\n")}\n */\n`
        : ""
      if (value === undefined)
        return docsPrefix + `${JSON.stringify(label)}: undefined`

      const isOptional = value.type === "option"
      const key = JSON.stringify(label) + (isOptional ? "?" : "")
      return docsPrefix + `${key}: ${next(value)}`
    })
    .join(", ")}}`
