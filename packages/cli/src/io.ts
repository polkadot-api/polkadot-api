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
import { ArraySort, GroupArraySort } from "@deepkit/topsort"

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
        const existingFile = await fs.readFile(rest.fileName, {
          encoding: "utf-8",
        })
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

  const constDeclarations = await Promise.all(
    variables.map(async (variable) => {
      const value = variable.value.replace(/(\r\n|\n|\r)/gm, "")
      const enumRegex = /(?<=Enum\(\{)(.*)(?=\}.*\))/g
      const vectorRegex = /(?<=Vector\()([a-zA-Z0-9_]*)(?=.*\))/g
      const tupleRegex = /(?<=Tuple\()(.*)(?=.*\))/g

      const vectorMatch = value.match(vectorRegex)
      const tupleMatch = value.match(tupleRegex)
      const enumMatch = value.match(enumRegex)

      if (vectorMatch && vectorMatch[0]) {
        const vectorType = `type I${variable.id} = Codec<CodecType<typeof ${vectorMatch[0]}>[]>`

        return `${vectorType}\nconst ${variable.id}: I${variable.id} = ${variable.value}\nexport type ${variable.id} = CodecType<typeof ${variable.id}>\n`
      }
      if (tupleMatch && tupleMatch[0]) {
        const tupleValues = tupleMatch[0].split(",").map((s) => s.trim())

        const tupleType = `type I${variable.id} = Codec<[${tupleValues.map(
          (s) => `CodecType<typeof ${s}>`,
        )}]>`

        return `${tupleType}\nconst ${variable.id}: I${variable.id} = ${variable.value}\nexport type ${variable.id} = CodecType<typeof ${variable.id}>\n`
      }

      if (enumMatch && enumMatch[0]) {
        const enumKeyValues = enumMatch[0]
          .split(",")
          .map((s) => s.split(":").map((s) => s.trim()) as [string, string])

        const enumType = `type I${variable.id} = Codec<${enumKeyValues
          .map(([k, v]) => `\{tag: \"${k}\", value: CodecType<typeof ${v}> \}`)
          .join("|")}>`

        return `${enumType}\nconst ${variable.id}: I${variable.id} = ${variable.value}\nexport type ${variable.id} = CodecType<typeof ${variable.id}>\n`
      }

      return `const ${variable.id}${
        variable.types ? ": " + variable.types : ""
      } = ${variable.value}\nexport type ${variable.id} = CodecType<typeof ${
        variable.id
      }>\n`
    }),
  )
  constDeclarations.unshift(
    `import {${[...declarations.imports].join(
      ", ",
    )}} from "@polkadot-api/substrate-bindings"`,
  )

  const tscFileName = path.join(outputFolder, `${key}`)
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

  descriptorCodegen +=
    constantDescriptors
      .map(
        ([pallet, name, checksum, payload]) =>
          `const ${pallet}${name}Constant = ${pallet}Creator.getPayloadDescriptor(CONST, ${checksum}n, \"${name}\", {} as unknown as ${
            declarations.imports.has(payload)
              ? `CodecType<typeof ${payload}>`
              : payload
          })`,
      )

      .join("\n\n") + "\n"
  descriptorCodegen +=
    storageDescriptors
      .map(([pallet, name, checksum, key, payload]) => {
        const returnType = declarations.imports.has(payload)
          ? `CodecType<typeof ${payload}>`
          : payload
        const len = declarations.variables.get(key)!.directDependencies.size

        const constName = `${pallet}${name}Storage`
        return `const ${constName} = ${pallet}Creator.getStorageDescriptor(
  ${checksum}n,
  \"${name}\",
  {len: ${len}} as ArgsWithPayloadCodec<${key}, ${returnType}>)

export type ${constName} = StorageType<typeof ${constName}>
`
      })
      .join("\n\n") + "\n"
  descriptorCodegen +=
    Object.values(eventDescriptors)
      .map(
        ([pallet, name, checksum, payload]) =>
          `const ${pallet}${name}Event = ${pallet}Creator.getPayloadDescriptor(EVENT, ${checksum}n, \"${name}\", {} as unknown as ${
            declarations.imports.has(payload)
              ? `CodecType<typeof ${payload}>`
              : payload
          })`,
      )
      .join("\n\n") + "\n"
  descriptorCodegen +=
    Object.values(errorDescriptors)
      .map(
        ([pallet, name, checksum, payload]) =>
          `const ${pallet}${name}Error = ${pallet}Creator.getPayloadDescriptor(ERROR, ${checksum}n, \"${name}\", {} as unknown as ${
            declarations.imports.has(payload)
              ? `CodecType<typeof ${payload}>`
              : payload
          })`,
      )
      .join("\n\n") + "\n"

  for (const [
    pallet,
    name,
    checksum,
    payload,
    events,
    errors,
  ] of callDescriptors) {
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

    descriptorCodegen +=
      `const ${pallet}${name}Call = ${pallet}Creator.getTxDescriptor(${checksum}n, "${name}", [${eventVariables.join(
        ",",
      )}], [${errorVariables.join(",")}], {} as unknown as ${
        declarations.imports.has(payload)
          ? `CodecType<typeof ${payload}>`
          : payload
      })` + "\n\n"
  }

  const descriptorVariablesRegexp = new RegExp(
    /(?<=const)\s(.*(Constant|Storage|Event|Error|Call))\s(?=\=)/g,
  )

  const descriptorVariableNames =
    descriptorCodegen.match(descriptorVariablesRegexp)?.map((s) => s.trim()) ??
    []

  descriptorCodegen +=
    `const result: [${descriptorVariableNames
      .map((s) => `typeof ${s}`)
      .join(",")}] = [${descriptorVariableNames.join(",")}]` +
    "\n\nexport default result\n\n"

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
}
