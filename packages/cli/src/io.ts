import {
  CodeDeclarations,
  getChecksumBuilder,
  getStaticBuilder,
} from "@unstoppablejs/substrate-codegen"
import fs from "fs/promises"
import { Data } from "./data"
import { ReadonlyRecord } from "fp-ts/lib/ReadonlyRecord"
import { deferred } from "./deferred"
import * as childProcess from "node:child_process"
import * as readPkg from "read-pkg"
import * as writePkg from "write-pkg"
import * as z from "zod"
import descriptorSchema from "./descriptor-schema"
import { encodeMetadata } from "./metadata"

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
      // TODO
      break
    }
  }
}

export async function writeMetadataToDisk(data: Data, outFile: string) {
  const encoded = encodeMetadata({
    magicNumber: data.magicNumber,
    metadata: data.metadata,
  })
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

  const constDeclarations = [...declarations.variables.values()].map(
    (variable) =>
      `const ${variable.id}${variable.types ? ": " + variable.types : ""} = ${
        variable.value
      }\nexport type ${variable.id} = CodecType<typeof ${variable.id}>`,
  )
  declarations.imports.add("CodecType")
  declarations.imports.add("Codec")
  constDeclarations.unshift(
    `import {${[...declarations.imports].join(
      ", ",
    )}} from "@unstoppablejs/substrate-bindings"`,
  )

  await fs.mkdir(outputFolder, { recursive: true })
  await fs.writeFile(
    `${outputFolder}/${key}.ts`,
    constDeclarations.join("\n\n"),
  )
  const tsc = deferred<number>()
  const process = childProcess.spawn("tsc", [
    `${outputFolder}/${key}.ts`,
    "--outDir",
    `${outputFolder}`,
    "--skipLibCheck",
    "--emitDeclarationOnly",
    "--declaration",
  ])

  process.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`)
  })

  process.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`)
  })

  process.on("close", (code) => {
    tsc.resolve(code ?? 1)
  })

  await tsc

  await fs.rm(`${outputFolder}/${key}.ts`)

  let descriptorCodegen = ""
  const descriptorTypeImports = [
    "DescriptorCommon",
    "ArgsWithPayloadCodec",
    "StorageDescriptor",
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
  ].join(", ")}} from "@unstoppablejs/substrate-bindings"\n`
  descriptorCodegen += `import type {${[...descriptorTypeImports].join(
    ", ",
  )}} from "@unstoppablejs/substrate-bindings"\n`
  descriptorCodegen += `import type {${[...declarations.variables.values()]
    .map((v) => v.id)
    .join(", ")}} from "./codegen"\n\n`

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

        return `const ${pallet}${name}Storage = ${pallet}Creator.getStorageDescriptor(
  ${checksum}n,
  \"${name}\",
  {len: ${len}} as ArgsWithPayloadCodec<${key}, ${returnType}>)`
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
}
