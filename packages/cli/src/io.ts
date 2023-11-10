import {
  CodeDeclarations,
  getChecksumBuilder,
  getStaticBuilder,
} from "@polkadot-api/substrate-codegen"
import fs from "fs/promises"
import { Data } from "./data"
import { ReadonlyRecord } from "fp-ts/lib/ReadonlyRecord"
import * as readPkg from "read-pkg"
import * as writePkg from "write-pkg"
import * as z from "zod"
import descriptorSchema from "./descriptor-schema"
import { encodeMetadata } from "./metadata"
import { dirname } from "path"
import fsExists from "fs.promises.exists"
import tsc from "tsc-prog"
import path from "path"
import { ESLint } from "eslint"

type ReadDescriptorsArgs = {
  pkgJSONKey: string
  fileName?: string
}

export async function readDescriptors(args: ReadDescriptorsArgs) {
  const descriptorMetadata = await (async () => {
    if (args.fileName) {
      const file = JSON.parse(
        await fs.readFile(args.fileName, { encoding: "utf-8" }),
      )
      const result = await descriptorSchema.parseAsync(file)

      return result
    }
    if (await fsExists("package.json")) {
      const pkgJSON = JSON.parse(
        await fs.readFile("package.json", { encoding: "utf-8" }),
      )
      const schema = z.object({ [args.pkgJSONKey]: descriptorSchema })

      const result = await schema.safeParseAsync(pkgJSON)
      if (result.success) {
        return result.data[args.pkgJSONKey]
      }
    }

    return
  })()

  return descriptorMetadata
}

type OutputDescriptorsArgs = (
  | {
      type: "package-json"
      pkgJSONKey: string
    }
  | {
      type: "file"
      fileName: string
    }
) & {
  data: Data
  key: string
  metadataFile: string
  outputFolder: string
}

export async function outputDescriptors({
  data,
  key,
  metadataFile,
  outputFolder,
  ...rest
}: OutputDescriptorsArgs) {
  switch (rest.type) {
    case "package-json": {
      let output: z.TypeOf<typeof descriptorSchema> = {}

      const pkgJSONSchema = z.object({
        [rest.pkgJSONKey]: descriptorSchema,
      })
      const pkgJSON = await readPkg.readPackage()
      const parseResult = await pkgJSONSchema.safeParseAsync(pkgJSON)
      if (parseResult.success) {
        output = parseResult.data[rest.pkgJSONKey]
      }

      output = {
        ...output,
        [key]: {
          metadata: metadataFile,
          outputFolder: outputFolder,
          descriptors: data.descriptorData,
        },
      }

      await writePkg.updatePackage({
        [rest.pkgJSONKey]: output,
      } as any)
      break
    }
    case "file": {
      let output: z.TypeOf<typeof descriptorSchema> = {}

      if (await fsExists(rest.fileName)) {
        const existingFile = JSON.parse(
          await fs.readFile(rest.fileName, {
            encoding: "utf-8",
          }),
        )
        output = await descriptorSchema.parseAsync(existingFile)
      }

      output = {
        ...output,
        [key]: {
          metadata: metadataFile,
          outputFolder: outputFolder,
          descriptors: data.descriptorData,
        },
      }

      await fs.mkdir(dirname(rest.fileName), { recursive: true })
      await fs.writeFile(rest.fileName, JSON.stringify(output, null, 2))
      break
    }
  }
}

export async function writeMetadataToDisk(data: Data, outFile: string) {
  const encoded = encodeMetadata({
    magicNumber: data.magicNumber,
    metadata: data.metadata,
  })
  await fs.mkdir(dirname(outFile), { recursive: true })
  await fs.writeFile(outFile, encoded)
}

export async function outputCodegen(
  data: Data,
  outputFolder: string,
  key: string,
) {
  const declarations: CodeDeclarations = {
    imports: new Set<string>(),
    variables: new Map(),
  }

  const { metadata } = data

  const { buildStorage, buildEvent, buildCall, buildConstant, buildError } =
    getStaticBuilder(metadata.value, declarations)
  const checksumBuilder = getChecksumBuilder(metadata.value)

  const constantDescriptors: [
    pallet: string,
    name: string,
    checksum: bigint,
    payload: string,
  ][] = []

  const storageDescriptors: [
    pallet: string,
    name: string,
    checksum: bigint,
    key: string,
    val: string,
  ][] = []

  const eventDescriptors: Record<
    string,
    [pallet: string, name: string, checksum: bigint, payload: string]
  > = {}
  const errorDescriptors: Record<
    string,
    [pallet: string, name: string, checksum: bigint, payload: string]
  > = {}

  const callDescriptors: [
    pallet: string,
    callName: string,
    checksum: bigint,
    payload: string,
    events: ReadonlyRecord<string, ReadonlySet<string>>,
    errors: ReadonlyRecord<string, ReadonlySet<string>>,
  ][] = []

  for (const [
    pallet,
    { constants, storage, events, extrinsics, errors },
  ] of Object.entries(data.descriptorData)) {
    for (const [constantName, checksum] of Object.entries(constants)) {
      const payload = buildConstant(pallet, constantName)
      constantDescriptors.push([pallet, constantName, checksum, payload])
    }
    for (const [entry, checksum] of Object.entries(storage)) {
      const { key, val } = buildStorage(pallet, entry)
      storageDescriptors.push([pallet, entry, checksum, key, val])
    }
    for (const [eventName, checksum] of Object.entries(events)) {
      const payload = buildEvent(pallet, eventName)
      eventDescriptors[`${pallet}${eventName}`] = [
        pallet,
        eventName,
        checksum,
        payload,
      ]
    }
    for (const [errorName, checksum] of Object.entries(errors)) {
      const payload = buildError(pallet, errorName)
      errorDescriptors[`${pallet}${errorName}`] = [
        pallet,
        errorName,
        checksum,
        payload,
      ]
    }
    for (const [callName, { events, errors }] of Object.entries(extrinsics)) {
      const payload = buildCall(pallet, callName)
      const checksum = checksumBuilder.buildCall(pallet, callName)!
      callDescriptors.push([
        pallet,
        callName,
        checksum,
        payload,
        events,
        errors,
      ])
    }
  }

  await fs.mkdir(outputFolder, { recursive: true })

  declarations.imports.add("CodecType")
  declarations.imports.add("Codec")
  declarations.imports.add("SS58String")
  declarations.imports.add("HexString")

  const variables = [...declarations.variables.values()]

  const constDeclarations = variables.map((variable) => {
    const value = variable.value.replace(/(\r\n|\n|\r)/gm, "")
    const enumRegex = /(?<=Enum\(\{)(.*)(?=\}.*\))/g
    const vectorRegex = /(?<=Vector\()([a-zA-Z0-9_]*)(?=.*\))/g
    const tupleRegex = /(?<=Tuple\()(.*)(?=.*\))/g

    const vectorMatch = value.match(vectorRegex)
    const tupleMatch = value.match(tupleRegex)
    const enumMatch = value.match(enumRegex)

    let declaration = ""

    if (vectorMatch && vectorMatch[0]) {
      declaration += `type I${variable.id} = Codec<CodecType<typeof ${vectorMatch[0]}>[]>\n`
      declaration += `const ${variable.id}: I${variable.id} = ${variable.value}\n`
    } else if (tupleMatch && tupleMatch[0]) {
      const tupleValues = tupleMatch[0].split(",").map((s) => s.trim())
      declaration += `type I${variable.id} = Codec<[${tupleValues.map(
        (s) => `CodecType<typeof ${s}>`,
      )}]>\n`
      declaration += `const ${variable.id}: I${variable.id} = ${variable.value}\n`
    } else if (enumMatch && enumMatch[0]) {
      const enumKeyValues = enumMatch[0]
        .split(",")
        .map((s) => s.split(":").map((s) => s.trim()) as [string, string])
      declaration += `type I${variable.id} = Codec<${enumKeyValues
        .map(([k, v]) => `\{tag: \"${k}\", value: CodecType<typeof ${v}> \}`)
        .join("|")}>\n`
      declaration += `const ${variable.id}: I${variable.id} = ${variable.value}\n`
    } else {
      declaration += `const ${variable.id}${
        variable.types ? ": " + variable.types : ""
      } = ${variable.value}\n`
    }

    declaration += `export type ${variable.id} = CodecType<typeof ${variable.id}>\n`

    return declaration
  })

  constDeclarations.unshift(
    `import {${[...declarations.imports].join(
      ", ",
    )}} from "@polkadot-api/substrate-bindings"`,
  )

  const tscFileName = path.join(outputFolder, key)
  const tscTypesFileName = path.join(outputFolder, `${key}-types`)

  if (await fsExists(`${tscTypesFileName}.d.ts`)) {
    await fs.rm(`${tscTypesFileName}.d.ts`)
  }
  if (await fsExists(`${tscFileName}.ts`)) {
    await fs.rm(`${tscFileName}.ts`)
  }

  await fs.writeFile(`${tscTypesFileName}.ts`, constDeclarations.join("\n\n"))

  tsc.build({
    basePath: outputFolder,
    compilerOptions: {
      skipLibCheck: true,
      emitDeclarationOnly: true,
      declaration: true,
      target: "esnext",
      module: "esnext",
      moduleResolution: "node",
    },
    include: [`${key}-types.ts`],
  })

  if (await fsExists(`${tscTypesFileName}.ts`)) {
    await fs.rm(`${tscTypesFileName}.ts`)
  }

  let descriptorCodegen = ""
  const descriptorTypeImports = [
    "DescriptorCommon",
    "ArgsWithPayloadCodec",
    "ArgsWithoutPayloadCodec",
    "StorageDescriptor",
    "StorageType",
    "ConstantDescriptor",
    "EventDescriptor",
    "ErrorDescriptor",
    "EventToObject",
    "UnionizeTupleEvents",
    "TxDescriptorArgs",
    "TxDescriptorEvents",
    "TxDescriptorErrors",
    "TxFunction",
  ]
  const descriptorImports = [
    "createCommonDescriptor",
    "getDescriptorCreator",
    "getPalletCreator",
  ]

  descriptorCodegen += `import {${[
    ...new Set([...declarations.imports, ...descriptorImports]),
  ].join(", ")}} from "@polkadot-api/substrate-bindings"\n`
  descriptorCodegen += `import type {${[...descriptorTypeImports].join(
    ", ",
  )}} from "@polkadot-api/substrate-bindings"\n`
  descriptorCodegen += `import type {${[...declarations.variables.values()]
    .map((v) => v.id)
    .join(", ")}} from "./${key}-types.d.ts"\n\n`

  descriptorCodegen += `const CONST = "const"\n\n`
  descriptorCodegen += `const EVENT = "event"\n\n`
  descriptorCodegen += `const ERROR = "error"\n\n`

  for (const pallet of Object.keys(data.descriptorData)) {
    descriptorCodegen += `const ${pallet}Creator = getPalletCreator(\"${pallet}\")\n\n`
  }

  const constantDescriptorNames = constantDescriptors.map(
    ([pallet, name]) => `${pallet}${name}Constant`,
  )

  descriptorCodegen +=
    constantDescriptors
      .map(
        ([pallet, name, checksum, payload], i) =>
          `const ${
            constantDescriptorNames[i]
          } = ${pallet}Creator.getPayloadDescriptor(CONST, ${checksum}n, \"${name}\", {} as unknown as ${
            declarations.imports.has(payload)
              ? `CodecType<typeof ${payload}>`
              : payload
          })`,
      )

      .join("\n\n") + "\n"

  const storageDescriptorsNames = storageDescriptors.map(
    ([pallet, name]) => `${pallet}${name}Storage`,
  )

  descriptorCodegen +=
    storageDescriptors
      .map(([pallet, name, checksum, key, payload], i) => {
        const returnType = declarations.imports.has(payload)
          ? `CodecType<typeof ${payload}>`
          : payload
        const len = declarations.variables.get(key)!.directDependencies.size

        const constName = `${storageDescriptorsNames[i]}`
        return `
type ${constName}Descriptor = StorageDescriptor<DescriptorCommon<\"${pallet}\", \"${name}\">, ArgsWithPayloadCodec<${key}, ${returnType}>>

const ${constName}: ${constName}Descriptor = ${pallet}Creator.getStorageDescriptor(
  ${checksum}n, 
  \"${name}\", 
  {len: ${len}} as ArgsWithPayloadCodec<${key}, ${returnType}>)

export type ${constName} = StorageType<typeof ${constName}>
`
      })
      .join("\n\n") + "\n"

  const eventDescriptorsNames = Object.values(eventDescriptors).map(
    ([pallet, name]) => `${pallet}${name}Event`,
  )

  descriptorCodegen +=
    Object.values(eventDescriptors)
      .map(
        ([pallet, name, checksum, payload], i) =>
          `const ${
            eventDescriptorsNames[i]
          }= ${pallet}Creator.getPayloadDescriptor(EVENT, ${checksum}n, \"${name}\", {} as unknown as ${
            declarations.imports.has(payload)
              ? `CodecType<typeof ${payload}>`
              : payload
          })`,
      )
      .join("\n\n") + "\n"

  const errorDescriptorsNames = Object.values(errorDescriptors).map(
    ([pallet, name]) => `${pallet}${name}Error`,
  )

  descriptorCodegen +=
    Object.values(errorDescriptors)
      .map(
        ([pallet, name, checksum, payload], i) =>
          `const ${
            errorDescriptorsNames[i]
          } = ${pallet}Creator.getPayloadDescriptor(ERROR, ${checksum}n, \"${name}\", {} as unknown as ${
            declarations.imports.has(payload)
              ? `CodecType<typeof ${payload}>`
              : payload
          })`,
      )
      .join("\n\n") + "\n"

  const callDescriptorNames = callDescriptors.map(
    ([pallet, name]) => `${pallet}${name}Call`,
  )

  callDescriptors.forEach(
    ([pallet, name, checksum, payload, events, errors], i) => {
      const eventVariables = Object.entries(events).reduce(
        (p, [pallet, palletEvents]) => [
          ...p,
          ...Array.from(palletEvents).map((e) => `${pallet}${e}Event`),
        ],
        [] as string[],
      )
      const errorVariables = Object.entries(errors).reduce(
        (p, [pallet, palletErrors]) => [
          ...p,
          ...Array.from(palletErrors).map((e) => `${pallet}${e}Error`),
        ],
        [] as string[],
      )

      const returnType = declarations.imports.has(payload)
        ? `CodecType<typeof ${payload}>`
        : payload
      const len =
        declarations.variables.get(returnType)?.directDependencies.size
      descriptorCodegen +=
        `const ${
          callDescriptorNames[i]
        } = ${pallet}Creator.getTxDescriptor(${checksum}n, "${name}", [${eventVariables.join(
          ",",
        )}], [${errorVariables.join(
          ",",
        )}], {len: ${len}} as ArgsWithoutPayloadCodec<${returnType}>)` + "\n\n"
    },
  )

  const descriptorVariableNames: [string, string[]][] = [
    ["constantDescriptors", constantDescriptorNames],
    ["storageDescriptors", storageDescriptorsNames],
    ["eventDescriptors", eventDescriptorsNames],
    ["errorDescriptors", errorDescriptorsNames],
    ["callDescriptors", callDescriptorNames],
  ]

  descriptorCodegen += descriptorVariableNames
    .map(
      ([constName, variableNames]) =>
        `const ${constName}: [${variableNames
          .map((s) => `typeof ${s}`)
          .join(",")}] = [${variableNames.join(",")}]\n`,
    )
    .join("\n\n")

  const descriptorVariableNamesKeys = descriptorVariableNames.map((a) => a[0])

  descriptorCodegen +=
    `const result: [${descriptorVariableNamesKeys
      .map((s) => `typeof ${s}`)
      .join(",")}] = [${descriptorVariableNamesKeys.join(",")}]` +
    "\n\nexport default result\n\n"

  descriptorCodegen = "// Generated by @polkadot-api/cli\n" + descriptorCodegen

  await fs.writeFile(`${outputFolder}/${key}.ts`, descriptorCodegen)

  const eslint = new ESLint({
    useEslintrc: false,
    fix: true,
    overrideConfig: {
      extends: ["plugin:prettier/recommended"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint", "unused-imports", "prettier"],
      rules: {
        "unused-imports/no-unused-imports": "error",
        "unused-imports/no-unused-vars:": "error",
        "max-len": ["error", { code: 120, ignoreUrls: true }],
      },
    },
  })

  const results = await eslint.lintFiles([`${outputFolder}/${key}.ts`])
  await ESLint.outputFixes(results)

  // Run tsc again to make sure the final .ts file has no compile errors
  {
    if (await fsExists(`${tscFileName}.d.ts`)) {
      await fs.rm(`${tscFileName}.d.ts`)
    }

    tsc.build({
      basePath: outputFolder,
      compilerOptions: {
        skipLibCheck: true,
        emitDeclarationOnly: true,
        declaration: true,
        target: "esnext",
        module: "esnext",
        moduleResolution: "node",
      },
      include: [`${key}.ts`],
    })

    if (await fsExists(`${tscFileName}.d.ts`)) {
      await fs.rm(`${tscFileName}.d.ts`)
    }
  }
}
