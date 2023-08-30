import { StringRecord, V14 } from "@capi-dev/substrate-bindings"
import { LookupEntry, getLookupFn } from "./lookups"

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

const toCamelCase = (...parts: string[]): string =>
  parts[0] +
  parts
    .slice(1)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("")

const _buildSyntax = (
  input: LookupEntry,
  declarations: CodeDeclarations,
  stack: Set<LookupEntry>,
  getVarName: (id: number, ...post: string[]) => string,
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

  if (input.type === "bitSequence") {
    declarations.imports.add(input.type)
    return input.type
  }

  if (
    input.type === "sequence" &&
    input.value.type === "primitive" &&
    input.value.value === "u8"
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

  if (declarations.variables.has(getVarName(input.id, "circular")))
    return getVarName(input.id, "circular")

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
      id: getVarName(input.id, "circular"),
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
    if (value.type === "primitive") {
      declarations.imports.add(value.value)
      return value.value
    }

    const varName = toCamelCase(varId, key)
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

export const getStaticBuilder = (
  metadata: V14,
  declarations: CodeDeclarations,
) => {
  const lookupData = metadata.lookup
  const getLookupEntryDef = getLookupFn(lookupData)

  const getVarName = (idx: number, ...post: string[]): string => {
    const { path } = lookupData[idx]
    const parts: string[] = path.length === 0 ? ["cdc" + idx] : ["c", ...path]

    parts.push(...post)

    return toCamelCase(...parts)
  }

  const buildDefinition = (id: number) =>
    _buildSyntax(getLookupEntryDef(id), declarations, new Set(), getVarName)

  const buildNamedTuple = (
    params: Array<{ name: string; type: number }>,
    varName: string,
  ) => {
    if (declarations.variables.has(varName)) return varName

    const args = params.map((p) => p.type).map(buildDefinition)
    const names = params.map((p) => p.name)
    declarations.imports.add("Tuple")
    declarations.imports.add("Codec")
    declarations.imports.add("CodecType")

    const variable: Variable = {
      id: varName,
      types: `Codec<[${names
        .map((name, pIdx) => `${name}: CodecType<typeof ${args[pIdx]}>`)
        .join(", ")}]>`,
      value: `Tuple(${args.join(", ")})`,
      directDependencies: new Set(args),
    }
    declarations.variables.set(varName, variable)

    return varName
  }

  const EMPTY_TUPLE_VAR_NAME = "_emptyTuple"
  const getEmptyTuple = () => {
    if (!declarations.variables.has(EMPTY_TUPLE_VAR_NAME)) {
      declarations.imports.add("Tuple")
      declarations.imports.add("Codec")

      declarations.variables.set(EMPTY_TUPLE_VAR_NAME, {
        id: EMPTY_TUPLE_VAR_NAME,
        types: `Codec<[]>`,
        value: `Tuple()`,
        directDependencies: new Set(),
      })
    }
    return EMPTY_TUPLE_VAR_NAME
  }

  const buildStorage = (pallet: string, entry: string) => {
    const storageEntry = metadata.pallets
      .find((x) => x.name === pallet)!
      .storage!.items.find((s) => s.name === entry)!

    if (storageEntry.type.tag === "plain")
      return {
        key: getEmptyTuple(),
        val: buildDefinition(storageEntry.type.value),
      }

    const { key, value } = storageEntry.type.value
    const val = buildDefinition(value)

    const returnKey =
      storageEntry.type.value.hashers.length === 1
        ? buildNamedTuple(
            [{ name: "key", type: key }],
            getVarName(key, "Tupled"),
          )
        : buildDefinition(key)

    return { key: returnKey, val }
  }

  const buildVariant =
    (type: "errors" | "events") => (pallet: string, name: string) => {
      const eventsLookup = getLookupEntryDef(
        metadata.pallets.find((x) => x.name === pallet)![type]! as number,
      )
      if (eventsLookup.type !== "enum") throw null

      const returnVar = toCamelCase(buildDefinition(eventsLookup.id), name)

      if (
        !declarations.variables.has(returnVar) &&
        eventsLookup.value[name].type === "primitive"
      ) {
        declarations.variables.set(returnVar, {
          id: returnVar,
          value: "_void",
          directDependencies: new Set(),
        })
      }

      return returnVar
    }

  const buildCall = (pallet: string, callName: string) => {
    const callsLookup = getLookupEntryDef(
      metadata.pallets.find((x) => x.name === pallet)!.calls! as number,
    )

    if (callsLookup.type !== "enum") throw null

    const callEntry = callsLookup.value[callName]
    if (callEntry.type === "primitive") return getEmptyTuple()
    if (callEntry.type === "tuple")
      return toCamelCase(buildDefinition(callsLookup.id), callName)

    const params = Object.entries(callEntry.value).map(([name, val]) => ({
      name,
      type: val.id,
    }))

    return buildNamedTuple(
      params,
      getVarName(callsLookup.id, callName, "Tupled"),
    )
  }

  const buildConstant = (pallet: string, constantName: string) => {
    const storageEntry = metadata.pallets
      .find((x) => x.name === pallet)!
      .constants!.find((s) => s.name === constantName)!

    return buildDefinition(storageEntry.type as number)
  }

  return {
    buildDefinition,
    buildStorage,
    buildEvent: buildVariant("events"),
    buildError: buildVariant("errors"),
    buildCall,
    buildConstant,
  }
}
