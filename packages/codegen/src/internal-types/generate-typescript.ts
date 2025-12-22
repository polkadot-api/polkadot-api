import {
  EnumVariant,
  LookupTypeNode,
  StructField,
  TypeNode,
} from "./type-representation"

export interface CodegenOutput {
  code: string
  imports: Record<string, Set<string>>
}

export type NodeCodeGenerator = (
  innerNode: TypeNode | LookupTypeNode,
  next: (node: TypeNode) => CodegenOutput,
  level: number,
) => CodegenOutput

/**
 * This function is chain-type agnostic. It will try its best to generate all
 * types, but will fail for non-native types (e.g. Binary)
 * This can be enhanced through composition.
 */
export const nativeNodeCodegen = (
  node: TypeNode,
  next: (node: TypeNode) => CodegenOutput,
): CodegenOutput => {
  if (node.type === "primitive" || node.type === "inline")
    return onlyCode(node.value)
  if (node.type === "chainPrimitive")
    throw new Error("Can't generate chain primitive type " + node.value)
  if (
    node.type === "result" ||
    node.type === "enum" ||
    node.type === "fixedSizeBinary"
  )
    throw new Error("Can't generate chain primitive type " + node.type)
  if (node.type === "array") {
    const { code, imports } = next(node.value.value)
    return { code: `Array<${code}>`, imports }
  }

  if (node.type === "struct") {
    return generateObjectCode(node.value, next)
  }
  if (node.type === "tuple") {
    const tupleResults = node.value.map(({ value }) => next(value))
    // docs seem to have no effect on tuples (VSCode)
    return {
      code: `[${tupleResults.map(({ code }) => code).join(", ")}]`,
      imports: mergeImports(tupleResults.map(({ imports }) => imports)),
    }
  }
  if (node.type === "union") {
    if (node.value.length === 1) return next(node.value[0])

    const partResults = node.value.map(next)
    return {
      code: partResults.map(({ code }) => `(${code})`).join(" | "),
      imports: mergeImports(partResults.map(({ imports }) => imports)),
    }
  }

  // Must be an option
  const optionResult = next(node.value)
  return {
    code: `(${optionResult.code}) | undefined`,
    imports: optionResult.imports,
  }
}

export function generateTypescript(
  node: TypeNode,
  getNodeCode: NodeCodeGenerator,
): CodegenOutput {
  const next = (node: TypeNode, level: number): CodegenOutput =>
    getNodeCode(node, (v) => next(v, level + 1), level)
  return next(node, 0)
}

export function processPapiPrimitives(
  node: TypeNode,
  getCode: (node: TypeNode) => CodegenOutput,
  isKnown?: boolean,
): CodegenOutput | null {
  const clientImport = (value: string) => ({ client: new Set([value]) })

  if (node.type === "chainPrimitive") {
    return node.value === "BitSequence"
      ? onlyCode(`Array<0 | 1>`)
      : {
          code: node.value,
          imports: {
            client: new Set([node.value]),
          },
        }
  }

  if (node.type === "result") {
    const okResult = getCode(node.value.ok)
    const koResult = getCode(node.value.ko)

    return {
      code: `ResultPayload<${okResult.code}, ${koResult.code}>`,
      imports: mergeImports([
        okResult.imports,
        koResult.imports,
        clientImport("ResultPayload"),
      ]),
    }
  }

  if (node.type === "enum") {
    const innerCode = generateObjectCode(node.value, getCode)

    if (!isKnown) {
      return {
        code: `AnonymousEnum<${innerCode.code}>`,
        imports: innerCode.imports,
      }
    }
    return {
      code: `Enum<${innerCode.code}>`,
      imports: mergeImports([innerCode.imports, clientImport("Enum")]),
    }
  }

  if (node.type === "fixedSizeBinary") {
    return {
      code: `SizedHex<${node.value}>`,
      imports: clientImport("SizedHex"),
    }
  }

  if (node.type === "array" && node.value.len) {
    const { code, imports } = getCode(node.value.value)
    return {
      code: `FixedSizeArray<${node.value.len}, ${code}>`,
      imports: mergeImports([imports, clientImport("FixedSizeArray")]),
    }
  }

  return null
}

export const generateObjectCode = (
  fields: (StructField | EnumVariant)[],
  next: (node: TypeNode) => CodegenOutput,
): CodegenOutput => {
  const innerValues = fields.map((field) => ({
    ...field,
    result: field.value ? next(field.value) : null,
  }))

  return {
    code: `{${innerValues
      .map(({ label, docs, value, result }) => {
        const docsPrefix = docs.length
          ? `\n/**\n${docs.map((doc) => ` * ${doc.trim()}`).join("\n")}\n */\n`
          : ""
        if (result === null)
          return docsPrefix + `${JSON.stringify(label)}: undefined`

        const isOptional = value?.type === "option"
        const key = JSON.stringify(label) + (isOptional ? "?" : "")
        return docsPrefix + `${key}: ${result.code}`
      })
      .join(", ")}}`,
    imports: mergeImports(innerValues.map((v) => v.result?.imports ?? {})),
  }
}

export const mergeImports = (
  imports: Array<CodegenOutput["imports"]>,
): CodegenOutput["imports"] => {
  if (!imports.length) return {}
  const result = { ...imports[0] }
  for (let i = 1; i < imports.length; i++) {
    Object.entries(imports[i]).forEach(
      ([type, value]) =>
        (result[type] = new Set([...(result[type] ?? []), ...value])),
    )
  }
  return result
}

export const onlyCode = (code: string): CodegenOutput => ({ code, imports: {} })
