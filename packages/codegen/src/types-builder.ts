import { StringRecord } from "@polkadot-api/substrate-bindings"
import {
  ArrayVar,
  getChecksumBuilder,
  LookupEntry,
  MetadataLookup,
  StructVar,
  TupleVar,
} from "@polkadot-api/metadata-builders"
import { withCache } from "./with-cache"
import { mapObject } from "@polkadot-api/utils"

type MetadataPrimitives =
  | "bool"
  | "char"
  | "str"
  | "u8"
  | "u16"
  | "u32"
  | "u64"
  | "u128"
  | "u256"
  | "i8"
  | "i16"
  | "i32"
  | "i64"
  | "i128"
  | "i256"

export const primitiveTypes: Record<
  MetadataPrimitives | "compactNumber" | "compactBn",
  string
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

export interface Variable {
  name: string

  checksum: string
  type: string
}

enum Mode {
  Anonymize, // Full normalization, used in building types
  TerminateKnown, // Denormalize, with termination on known types, used for docs
}

export interface CodeDeclarations {
  imports: Set<string>
  // checksum -> Variable;
  // in Mode.Anonymize contains normalized types for every checksum,
  // in Mode.TerminateKnown contains expanded types, with duplication
  variables: Map<string, Variable>
  takenNames: Set<string>
}

export const defaultDeclarations = (): CodeDeclarations => ({
  imports: new Set(),
  variables: new Map(),
  takenNames: new Set(),
})

interface TypeForEntry {
  type: string
  import?: "globalTypes" | "client"
}

const typesImport = (varName: string): TypeForEntry => ({
  type: varName,
  import: "globalTypes",
})

const clientImport = (varName: string): TypeForEntry => ({
  type: varName,
  import: "client",
})

/**
 * In TerminateKnown mode, we need to store imports for each type,
 * including nested types, which can be cached It stores imports in a map for
 * current type and all types up the stack.
 */
class ImportsCollector {
  constructor(
    // checksum -> imports
    private importsPerType: Map<string, Set<string>>,
    // checksum
    private stack: Set<string>,
  ) {}

  addImport(type: string) {
    for (const checksum of this.stack) {
      if (!this.importsPerType.has(checksum)) {
        this.importsPerType.set(checksum, new Set())
      }
      this.importsPerType.get(checksum)!.add(type)
    }
  }

  nest(checksum: string): ImportsCollector {
    // We've probably already met this type and have cached it
    // let's populate imports up the stack
    if (this.importsPerType.has(checksum)) {
      for (const type of this.importsPerType.get(checksum)!) {
        this.addImport(type)
      }
    }
    return new ImportsCollector(
      this.importsPerType,
      new Set([...this.stack, checksum]),
    )
  }

  newStack(checksum: string): ImportsCollector {
    return new ImportsCollector(this.importsPerType, new Set([checksum]))
  }
}

const _buildSyntax = (
  input: LookupEntry,
  cache: Map<number, TypeForEntry>,
  stack: Set<number>,
  declarations: CodeDeclarations,
  getChecksum: (id: number | StructVar | TupleVar | ArrayVar) => string | null,
  knownTypes: Record<string, string>,
  callsChecksum: string | null,
  mode: Mode,
  importsCollector: ImportsCollector | undefined, // defined only in Mode.TerminateKnown
  expandKnownType: boolean | undefined, // defined only in Mode.TerminateKnown
): TypeForEntry => {
  const addImport = (entry: TypeForEntry) => {
    if (entry.import === "client") {
      declarations.imports.add(entry.type)
    } else if (mode === Mode.TerminateKnown) {
      importsCollector?.addImport(entry.type)
    }
  }

  const createVariable = (checksum: string, name: string) => {
    const variable: Variable = {
      checksum,
      type: "",
      name,
    }

    declarations.variables.set(checksum, variable)

    return variable
  }

  const getName = (checksum: string) => {
    if (!knownTypes[checksum]) return `I${checksum}`

    const originalName = knownTypes[checksum]
    let name = originalName
    let i = 1
    while (declarations.takenNames.has(name)) name = originalName + i++

    declarations.takenNames.add(name)
    return name
  }

  const anonymize = (varName: string) => {
    if (!varName.startsWith("I")) return varName
    const checksum = varName.slice(1)
    return declarations.variables.has(checksum)
      ? `Anonymize<${varName}>`
      : varName
  }

  if (input.type === "primitive") return { type: primitiveTypes[input.value] }
  if (input.type === "void") return { type: "undefined" }
  if (input.type === "AccountId20") return clientImport("HexString")
  if (input.type === "AccountId32") return clientImport("SS58String")
  if (input.type === "compact")
    return {
      type: input.isBig
        ? "bigint"
        : input.isBig === null
          ? "number | bigint"
          : "number",
    }
  if (input.type === "bitSequence")
    return { type: "{bytes: Uint8Array, bitsLen: number}" }

  if (
    input.type === "sequence" &&
    input.value.type === "primitive" &&
    input.value.value === "u8"
  )
    return { type: "Binary" }

  const checksum = getChecksum(input.id)!

  // In Mode.TerminateKnown, we need to generate type definition for known types as well,
  // but separately from currently from current type
  if (
    mode === Mode.TerminateKnown &&
    knownTypes[checksum] &&
    !declarations.variables.has(checksum)
  ) {
    const name = knownTypes[checksum]
    const variable: Variable = {
      checksum,
      type: "",
      name,
    }

    declarations.variables.set(checksum, variable)

    // We aren't nesting anymore, thus new stack and importsCollector
    const nextType = _buildSyntax(
      input,
      cache,
      new Set(),
      declarations,
      getChecksum,
      knownTypes,
      callsChecksum,
      mode,
      importsCollector?.newStack(checksum),
      true,
    )

    variable.type = nextType.type
  }

  // Problem: checksum WndPalletEvent = 5ofh7hnvff54m; DotPalletEvent = KsmPalletEvent = 2gc4echvba3ni
  // declarations.variables is checksum -> Var, but now we can have two names for the same checksum
  // currently, the second chain will reuse the first name, so ksm types will have DotPalletEvent (and KsmPalletEvent doesn't exist)
  // TODO declarations.variables should have a way of having multiple type definitions for the same checksum
  // TODO declarations.takenNames should be solved on `resolveConflicts` instead.
  if (declarations.variables.has(checksum)) {
    const entry = declarations.variables.get(checksum)!
    const type = typesImport(entry.name)

    if (mode === Mode.Anonymize) {
      return type
    } else if (knownTypes[checksum] && !expandKnownType) {
      addImport(type)
      return type
    }
  }

  const buildNextSyntax = (nextInput: LookupEntry) => {
    const checksum = getChecksum(nextInput.id)!
    const type = buildSyntax(
      nextInput,
      cache,
      stack,
      declarations,
      getChecksum,
      knownTypes,
      callsChecksum,
      mode,
      importsCollector?.nest(checksum),
      false,
    )

    if (mode === Mode.Anonymize || knownTypes[checksum]) {
      addImport(type)
    }
    return type
  }

  const buildVector = (id: string, inner: LookupEntry): TypeForEntry => {
    const name = getName(id)
    const variable = createVariable(id, name)

    const innerType = buildNextSyntax(inner)

    if (mode === Mode.Anonymize) {
      variable.type = `Array<${anonymize(innerType.type)}>`
      return typesImport(name)
    } else {
      return typesImport(innerType.type)
    }
  }

  const buildArray = (
    id: string,
    inner: LookupEntry,
    length: number,
  ): TypeForEntry => {
    const name = getName(id)
    const variable = createVariable(id, name)

    if (inner.type === "primitive" && inner.value === "u8") {
      variable.type = `FixedSizeBinary<${length}>`
    } else {
      const innerType = buildNextSyntax(inner)

      variable.type =
        mode === Mode.Anonymize
          ? `FixedSizeArray<${length}, ${anonymize(innerType.type)}>`
          : `FixedSizeArray<${length}, ${innerType.type}>`
    }

    if (mode === Mode.Anonymize) {
      return typesImport(name)
    } else {
      return typesImport(variable.type)
    }
  }

  const buildTuple = (id: string, value: LookupEntry[]): TypeForEntry => {
    const name = getName(id)
    const variable = createVariable(id, name)

    const innerTypes: string[] = []
    for (const entry of value) {
      const innerType = buildNextSyntax(entry)
      innerTypes.push(innerType.type)
    }

    variable.type = `[${innerTypes.map((v) => (mode === Mode.Anonymize ? anonymize(v) : v)).join(", ")}]`

    if (mode === Mode.Anonymize) {
      return typesImport(name)
    } else {
      return typesImport(variable.type)
    }
  }

  const buildStruct = (
    id: string,
    value: StringRecord<LookupEntry>,
  ): TypeForEntry => {
    const name = getName(id)
    const variable = createVariable(id, name)

    const deps = mapObject(value, buildNextSyntax)

    variable.type = `{${Object.entries(deps)
      .map(
        ([key, val]) =>
          `${JSON.stringify(key)}: ${mode === Mode.Anonymize ? anonymize(val.type) : val.type}`,
      )
      .join(", ")}}`

    if (mode === Mode.Anonymize) {
      return typesImport(name)
    } else {
      return typesImport(variable.type)
    }
  }

  if (input.type === "array") {
    return buildArray(checksum, input.value, input.len)
  }

  if (input.type === "sequence") return buildVector(checksum, input.value)
  if (input.type === "tuple") return buildTuple(checksum, input.value)
  if (input.type === "struct") return buildStruct(checksum, input.value)

  if (input.type === "option") {
    const name = getName(checksum)
    const variable = createVariable(checksum, name)

    const innerType = buildNextSyntax(input.value)

    variable.type = `${mode === Mode.Anonymize ? anonymize(innerType.type) : innerType.type} | undefined`

    if (mode === Mode.Anonymize) {
      return typesImport(name)
    } else {
      return typesImport(variable.type)
    }
  }

  if (input.type === "result") {
    declarations.imports.add("ResultPayload")
    const name = getName(checksum)
    const variable = createVariable(checksum, name)

    const ok = buildNextSyntax(input.value.ok)
    const ko = buildNextSyntax(input.value.ko)
    variable.type =
      mode === Mode.Anonymize
        ? `ResultPayload<${anonymize(ok.type)}, ${anonymize(ko.type)}>`
        : `ResultPayload<${ok.type}, ${ko.type}>`

    if (mode === Mode.Anonymize) {
      return typesImport(name)
    } else {
      return typesImport(variable.type)
    }
  }

  // it has to be an enum by now
  const isKnown = !!knownTypes[checksum]

  const name = getName(checksum)
  const variable = createVariable(checksum, name)

  const dependencies = Object.values(input.value).map((value) => {
    const anonymize = (value: string) => `Anonymize<${value}>`
    if (value.type === "lookupEntry") {
      const inner = buildNextSyntax(value.value)
      if (mode === Mode.Anonymize) {
        return anonymize(inner.type)
      }
      return inner.type
    }

    if (value.type === "void") return "undefined"

    let innerChecksum = getChecksum(value)!

    if (mode === Mode.TerminateKnown && knownTypes[innerChecksum]) {
      return innerChecksum
    }

    const inner = (() => {
      switch (value.type) {
        case "array":
          return buildArray(innerChecksum, value.value, value.len)
        case "struct":
          return buildStruct(innerChecksum, value.value)
        case "tuple":
          return buildTuple(innerChecksum, value.value)
      }
    })()

    if (mode === Mode.Anonymize) {
      addImport(inner)
      return anonymize(inner.type)
    }
    return inner.type
  })

  const obj = Object.keys(input.value)
    .map((key, idx) => `"${key}": ${dependencies[idx]}`)
    .join(", ")

  variable.type =
    isKnown || mode === Mode.TerminateKnown
      ? `Enum<{${obj}}>`
      : `AnonymousEnum<{${obj}}>`

  if (checksum === callsChecksum) {
    return clientImport("TxCallData")
  }

  return typesImport(mode === Mode.Anonymize ? name : variable.type)
}

const buildSyntax = withCache(
  _buildSyntax,
  (
    _getter,
    entry,
    declarations,
    getChecksum,
    knownTypes,
    callsChecksum,
    mode,
  ): TypeForEntry => {
    const checksum = getChecksum(entry.id)!
    if (checksum === callsChecksum) return clientImport("TxCallData")

    if (mode === Mode.Anonymize) {
      return typesImport(declarations.variables.get(checksum)!.name)
    } else {
      if (knownTypes[checksum]) {
        return typesImport(
          declarations.variables.get(knownTypes[getChecksum(entry.id)!])!.name,
        )
      }
      return {
        import: undefined,
        type: "__Circular",
      }
    }
  },
  (x) => x,
  (result) => !result.type.includes("__Circular"),
)

export const getTypesBuilder = (
  declarations: CodeDeclarations,
  getLookupEntryDef: MetadataLookup,
  // checksum -> desired-name
  knownTypes: Record<string, string>,
  checksumBuilder: ReturnType<typeof getChecksumBuilder>,
) => {
  const { metadata, call } = getLookupEntryDef
  const callsChecksum = call ? checksumBuilder.buildDefinition(call) : null

  const typeFileImports = new Set<string>()
  const clientFileImports = new Set<string>()

  const importType = (entry: TypeForEntry) => {
    if (entry.import === "client") {
      clientFileImports.add(entry.type)
    } else if (entry.import === "globalTypes") {
      typeFileImports.add(entry.type)
    }
    return entry.type
  }

  const getChecksum = (id: number | StructVar | TupleVar | ArrayVar): string =>
    typeof id === "number"
      ? checksumBuilder.buildDefinition(id)!
      : checksumBuilder.buildComposite(id)!

  const cache = new Map()
  const buildDefinition = (id: number) =>
    buildSyntax(
      getLookupEntryDef(id),
      cache,
      new Set(),
      declarations,
      getChecksum,
      knownTypes,
      callsChecksum,
      Mode.Anonymize,
      undefined,
      undefined,
    )

  const buildTypeDefinition = (id: number) => {
    const tmp = buildDefinition(id)
    importType(tmp)

    if (!tmp.import || tmp.import === "client") return tmp.type

    const checksum = checksumBuilder.buildDefinition(id)!
    if (knownTypes[checksum]) return tmp.type

    return `Anonymize<${tmp.type}>`
  }

  const buildStorage = (pallet: string, entry: string) => {
    const storageEntry = metadata.pallets
      .find((x) => x.name === pallet)!
      .storage!.items.find((s) => s.name === entry)!

    if (storageEntry.type.tag === "plain")
      return {
        key: "[]",
        val: `${buildTypeDefinition(storageEntry.type.value)}`,
      }

    const { key, value } = storageEntry.type.value
    const val = buildTypeDefinition(value)

    const returnKey =
      storageEntry.type.value.hashers.length === 1
        ? `[Key: ${buildTypeDefinition(key)}]`
        : buildTypeDefinition(key)

    return { key: returnKey, val }
  }

  const buildRuntimeCall = (api: string, method: string) => {
    const entry = metadata.apis
      .find((x) => x.name === api)
      ?.methods.find((x) => x.name === method)
    if (!entry) throw null

    const innerTuple = entry.inputs
      .map(({ name, type }) => `${name}: ${buildTypeDefinition(type)}`)
      .join(", ")

    return {
      args: `[${innerTuple}]`,
      value: buildTypeDefinition(entry.output),
    }
  }

  const buildVariant =
    (type: "errors" | "events" | "calls") => (pallet: string, name: string) => {
      const lookupEntry = getLookupEntryDef(
        metadata.pallets.find((x) => x.name === pallet)![type]! as number,
      )
      if (lookupEntry.type !== "enum") throw null

      // Generate the type that has all the variants - This is so the consumer can import the type, even if it's not used directly by the descriptor file
      buildDefinition(lookupEntry.id)

      const innerLookup = lookupEntry.value[name]

      if (innerLookup.type === "lookupEntry") {
        const tmp = buildDefinition(innerLookup.value.id)
        importType(tmp)

        return tmp.import === "client" ? tmp.type : `Anonymize<${tmp.type}>`
      } else if (innerLookup.type === "void") {
        return "undefined"
      } else {
        const result = declarations.variables.get(
          getChecksum(innerLookup),
        )!.name
        typeFileImports.add(result)

        return `Anonymize<${result}>`
      }
    }

  const buildConstant = (pallet: string, constantName: string) => {
    const storageEntry = metadata.pallets
      .find((x) => x.name === pallet)!
      .constants!.find((s) => s.name === constantName)!

    return buildTypeDefinition(storageEntry.type)
  }

  return {
    buildTypeDefinition,
    buildDefinition,
    buildStorage,
    buildEvent: buildVariant("events"),
    buildError: buildVariant("errors"),
    buildCall: buildVariant("calls"),
    buildRuntimeCall,
    buildConstant,
    getTypeFileImports: () => Array.from(typeFileImports),
    getClientFileImports: () => Array.from(clientFileImports),
  }
}

export const getDocsTypesBuilder = (
  getLookupEntryDef: MetadataLookup,
  knownTypes: Record<string, string>,
  checksumBuilder: ReturnType<typeof getChecksumBuilder>,
) => {
  const { metadata, call } = getLookupEntryDef
  const callsChecksum = call ? checksumBuilder.buildDefinition(call) : null
  const clientFileImports = new Set<string>()
  const fileTypeEntries = new Set<number>()

  // checksum -> types that are imported for it
  const importsPerType = new Map<string, Set<string>>()

  const declarations = defaultDeclarations()

  const getChecksum = (id: number | StructVar | TupleVar | ArrayVar): string =>
    typeof id === "number"
      ? checksumBuilder.buildDefinition(id)!
      : checksumBuilder.buildComposite(id)!

  const cache = new Map()
  const buildDefinition = (id: number) =>
    buildSyntax(
      getLookupEntryDef(id),
      cache,
      new Set(), // stack
      declarations,
      getChecksum,
      knownTypes,
      callsChecksum,
      Mode.TerminateKnown,
      new ImportsCollector(importsPerType, new Set([getChecksum(id)])),
      false,
    )

  const buildTypeDefinition = (id: number) => {
    fileTypeEntries.add(id)
    const tmp = buildDefinition(id)

    return tmp.type
  }

  const buildStorage = (pallet: string, entry: string) => {
    const storageEntry = metadata.pallets
      .find((x) => x.name === pallet)!
      .storage!.items.find((s) => s.name === entry)!

    if (storageEntry.type.tag === "plain")
      return {
        args: "[]",
        payload: `${buildTypeDefinition(storageEntry.type.value)}`,
      }

    const { key, value } = storageEntry.type.value
    const payload = buildTypeDefinition(value)

    const returnKey =
      storageEntry.type.value.hashers.length === 1
        ? `[Key: ${buildTypeDefinition(key)}]`
        : buildTypeDefinition(key)

    return { args: returnKey, payload }
  }

  const buildRuntimeCall = (api: string, method: string) => {
    const entry = metadata.apis
      .find((x) => x.name === api)
      ?.methods.find((x) => x.name === method)
    if (!entry) throw null

    const innerTuple = entry.inputs
      .map(({ name, type }) => `${name}: ${buildTypeDefinition(type)}`)
      .join(", ")

    return {
      args: `[${innerTuple}]`,
      value: buildTypeDefinition(entry.output),
    }
  }

  const buildVariant =
    (type: "errors" | "events" | "calls") => (pallet: string, name: string) => {
      const lookupEntry = getLookupEntryDef(
        metadata.pallets.find((x) => x.name === pallet)![type]! as number,
      )
      if (lookupEntry.type !== "enum") throw null

      const innerLookup = lookupEntry.value[name]

      if (innerLookup.type === "lookupEntry") {
        return buildTypeDefinition(innerLookup.value.id)
      } else if (innerLookup.type === "void") {
        return "undefined"
      } else {
        // building all variants, in order to populate declarations.variables
        buildTypeDefinition(lookupEntry.id)
        const innerChecksum = getChecksum(innerLookup)
        const innerVariable = declarations.variables.get(innerChecksum)
        if (!innerVariable) {
          throw new Error(
            `Unable to build ${type} variant for ${pallet}::${name}: ${innerChecksum} not populated`,
          )
        }

        return innerVariable.type
      }
    }

  const buildConstant = (pallet: string, constantName: string) => {
    const storageEntry = metadata.pallets
      .find((x) => x.name === pallet)!
      .constants!.find((s) => s.name === constantName)!

    return buildTypeDefinition(storageEntry.type)
  }

  const recordTypeFileImports = (): string[] => {
    const allImports = new Set<string>()
    for (const id of fileTypeEntries) {
      const thisTypeImports = importsPerType.get(getChecksum(id))
      if (!thisTypeImports) continue

      for (const singleType of thisTypeImports.values()) {
        allImports.add(singleType)
      }
    }
    fileTypeEntries.clear()
    return Array.from(allImports)
  }

  const getDescriptorsTypes = (): Variable[] =>
    [...declarations.variables.entries()]
      .filter(([checksum]) => knownTypes[checksum])
      .map(([_, variable]) => variable)

  return {
    buildStorage,
    buildRuntimeCall,
    buildEvent: buildVariant("events"),
    buildError: buildVariant("errors"),
    buildCall: buildVariant("calls"),
    buildConstant,
    declarations,
    recordTypeFileImports,
    getClientFileImports: () => Array.from(clientFileImports),
    getDescriptorsTypes,
  }
}
