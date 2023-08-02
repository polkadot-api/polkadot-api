import { StringRecord } from "@unstoppablejs/substrate-codecs"
import { LookupEntry } from "./lookups"

export interface Variable {
  id: string
  types?: string
  value: string
  directDependencies: Set<string>
}

export interface CodeDeclarations {
  imports: Set<string>
  variables: Map<string, Variable>
}

const _buildSyntax = (
  input: LookupEntry,
  declarations: CodeDeclarations,
  stack: Set<LookupEntry>,
  getVarName: (id: number, isCircular?: boolean) => string,
): string => {
  if (input.type === "primitive") {
    declarations.imports.add(input.value)
    return input.value
  }

  if (input.type === "compact") {
    const importVal = input.isBig ? "compactBn" : "compactNumber"
    declarations.imports.add(importVal)
    return importVal
  }

  if (
    input.type === "bitSequence" ||
    (input.type === "sequence" &&
      input.value.type === "primitive" &&
      input.value.value === "u8")
  ) {
    declarations.imports.add("Bytes")
    const variable = {
      id: "_bytesSeq",
      value: "Bytes()",
      directDependencies: new Set<string>(),
    }

    if (!declarations.variables.has(variable.id)) {
      declarations.variables.set(variable.id, variable)
    }

    return variable.id
  }

  if (declarations.variables.has(getVarName(input.id, true)))
    return getVarName(input.id, true)

  if (declarations.variables.has(getVarName(input.id)))
    return getVarName(input.id)

  const buildNextSyntax = (nextInput: LookupEntry): string => {
    if (!stack.has(nextInput)) {
      const nextStack = new Set(stack)
      nextStack.add(input)
      return _buildSyntax(nextInput, declarations, nextStack, getVarName)
    }

    const nonCircular = getVarName(input.id)
    const variable: Variable = {
      id: getVarName(input.id, true),
      types: `Codec<{ self: CodecType<typeof ${nonCircular}> }>`,
      value: `Self(() => ${nonCircular})`,
      directDependencies: new Set([nonCircular]),
    }

    declarations.imports.add("Codec")
    declarations.imports.add("CodecType")
    declarations.imports.add("Self")
    declarations.variables.set(variable.id, variable)
    return variable.id
  }

  const buildVector = (id: string, inner: LookupEntry, len?: number) => {
    declarations.imports.add("Vector")
    const dependsVar = buildNextSyntax(inner)
    const args = len ? [dependsVar, len] : [dependsVar]
    const variable = {
      id,
      value: `Vector(${args.join(", ")})`,
      directDependencies: new Set<string>([dependsVar]),
    }
    declarations.variables.set(id, variable)
    return id
  }

  const buildTuple = (id: string, value: LookupEntry[]) => {
    declarations.imports.add("Tuple")
    const deps = value.map(buildNextSyntax)
    const variable = {
      id,
      value: `Tuple(${deps.join(", ")})`,
      directDependencies: new Set(deps),
    }
    declarations.variables.set(id, variable)
    return id
  }

  const buildStruct = (id: string, value: StringRecord<LookupEntry>) => {
    declarations.imports.add("Struct")
    const deps = Object.values(value).map(buildNextSyntax)
    const variable = {
      id,
      value: `Struct({${Object.keys(value)
        .map((key, idx) => `${key}: ${deps[idx]}`)
        .join(", ")}})`,

      directDependencies: new Set(deps),
    }
    declarations.variables.set(id, variable)
    return id
  }

  const varId = getVarName(input.id)
  if (input.type === "array") {
    // Bytes case
    if (input.value.type === "primitive" && input.value.value === "u8") {
      declarations.imports.add("Bytes")
      declarations.variables.set(varId, {
        id: varId,
        value: `Bytes(${input.len})`,
        directDependencies: new Set<string>(),
      })
      return varId
    }

    // non-fixed size Vector case
    return buildVector(varId, input.value, input.len)
  }

  if (input.type === "sequence") return buildVector(varId, input.value)
  if (input.type === "tuple") return buildTuple(varId, input.value)
  if (input.type === "struct") return buildStruct(varId, input.value)

  // it has to be an enum by now
  declarations.imports.add("Enum")
  const dependencies = Object.entries(input.value).map(([key, value]) => {
    if (value.type === "_void") {
      declarations.imports.add(value.type)
      return value.type
    }

    if (value.type === "codecEntry") return buildNextSyntax(value.value)

    const varName = varId + key
    if (value.type === "tuple") {
      buildTuple(varName, value.value)
    } else {
      buildStruct(varName, value.value)
    }
    return varName
  })

  const indexes = Object.values(input.value).map((x) => x.idx)
  const areIndexesSorted = indexes.every((idx, i) => idx === i)

  const innerEnum = `{${Object.keys(input.value).map(
    (key, idx) => `${key}: ${dependencies[idx]}`,
  )}}${areIndexesSorted ? "" : `, [${indexes.join(", ")}]`}`

  declarations.variables.set(varId, {
    id: varId,
    value: `Enum(${innerEnum})`,
    directDependencies: new Set<string>(dependencies),
  })
  return varId
}

export const buildSyntax = (
  input: LookupEntry,
  getVarName: (id: number, isCircular?: boolean) => string,
): { declarations: CodeDeclarations; varName: string } => {
  const declarations: CodeDeclarations = {
    variables: new Map(),
    imports: new Set(),
  }

  return {
    declarations,
    varName: _buildSyntax(input, declarations, new Set(), getVarName),
  }
}
