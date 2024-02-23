import { mapObject } from "@polkadot-api/utils"
import fsExists from "fs.promises.exists"
import fs from "fs/promises"
import path from "path"
import tsc from "tsc-prog"
import { ApiData, PalletData } from "./types"

const customStringifyObject = (
  input: string | Record<string, any> | Array<any>,
): string => {
  if (typeof input === "string") return input

  if (Array.isArray(input))
    return `[${input.map(customStringifyObject).join(", ")}]`

  return `{${Object.entries(mapObject(input, customStringifyObject))
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ")}}`
}

const docsCodegen = (obj: Record<string, { types: string; docs?: string[] }>) =>
  `{\n${Object.entries(obj)
    .map(([key, value]) => {
      const definition = `${key}: ${value.types}`
      const docs = value.docs?.length
        ? `/**\n${value.docs.map((doc) => ` *${doc}`).join("\n")}\n */`
        : null

      return value.docs?.length ? `${docs}\n${definition}` : definition
    })
    .join(",\n")}\n}`

export const createDescriptorsFile = async (
  key: string,
  outputFolder: string,
  descriptors: {
    pallets: Record<string, PalletData>
    apis: Record<string, ApiData>
  },
  enums: Array<string>,
  asset: null | { checksum: string; type: string },
) => {
  const { pallets, apis } = descriptors

  const knownImports: Array<string> = [
    `import type { GetEnum, RuntimeDescriptor, PlainDescriptor, TxDescriptor, StorageDescriptor, QueryFromDescriptors,TxFromDescriptors,EventsFromDescriptors,ErrorsFromDescriptors,ConstFromDescriptors } from "@polkadot-api/client"\n`,
    `import { _Enum } from "@polkadot-api/client"\n`,
  ]
  const keyTypesImports: Array<string> = []
  const addTypeImport = (type: string) => {
    keyTypesImports.push(type)
  }

  const code: Array<string> = []
  const addLine = (line: string) => {
    code.push(line)
  }

  type Descriptors = Record<
    string,
    Record<
      string,
      {
        varName: string
        types: string
        docs: string[]
      }
    >
  >
  const stgDescriptors: Descriptors = {}
  const txDescriptors: Descriptors = {}
  const evDescriptors: Descriptors = {}
  const errDescriptors: Descriptors = {}
  const constDescriptors: Descriptors = {}

  type RuntimeDescriptors = Record<
    string,
    {
      docs: string[]
      methods: Record<
        string,
        {
          varName: string
          types: string
          docs: string[]
        }
      >
    }
  >
  const runtimeDescriptors: RuntimeDescriptors = {}

  for (const [
    pallet,
    { errors, events, constants, storage, tx },
  ] of Object.entries(pallets)) {
    errDescriptors[pallet] = {}
    for (const [errorName, { checksum, payload, docs }] of Object.entries(
      errors,
    )) {
      const types = `PlainDescriptor<${payload}>`
      const varName = `Err${pallet}${errorName}`
      errDescriptors[pallet][errorName] = { types, varName, docs }
      addTypeImport(payload)
      addLine(`const ${varName}: ${types} = "${checksum}" as ${types};`)
    }

    evDescriptors[pallet] = {}
    for (const [evName, { checksum, payload, docs }] of Object.entries(
      events,
    )) {
      const types = `PlainDescriptor<${payload}>`
      const varName = `Ev${pallet}${evName}`
      evDescriptors[pallet][evName] = { types, varName, docs }
      addTypeImport(payload)
      addLine(`const ${varName}: ${types} = "${checksum}" as ${types}`)
    }

    constDescriptors[pallet] = {}
    for (const [constName, { checksum, payload, docs }] of Object.entries(
      constants,
    )) {
      const types = `PlainDescriptor<${payload}>`
      const varName = `Const${pallet}${constName}`
      constDescriptors[pallet][constName] = { types, varName, docs }
      addTypeImport(payload)
      addLine(`const ${varName}: ${types} = "${checksum}" as ${types}`)
    }

    txDescriptors[pallet] = {}
    for (const [txName, { checksum, payload, docs }] of Object.entries(tx)) {
      const types = `TxDescriptor<${payload}>`
      const varName = `Tx${pallet}${txName}`
      txDescriptors[pallet][txName] = { types, varName, docs }
      addTypeImport(payload)
      addLine(`const ${varName}: ${types} = "${checksum}" as ${types}`)
    }

    stgDescriptors[pallet] = {}
    for (const [
      stgName,
      { checksum, payload, key, isOptional, docs },
    ] of Object.entries(storage)) {
      const types = `StorageDescriptor<${key}, ${payload}, ${isOptional}>`
      const varName = `Stg${pallet}${stgName}`
      stgDescriptors[pallet][stgName] = { types, varName, docs }
      addTypeImport(key)
      addTypeImport(payload)
      addLine(`const ${varName}: ${types} = "${checksum}" as ${types}`)
    }
  }

  for (const [namespace, { methods, docs }] of Object.entries(apis)) {
    runtimeDescriptors[namespace] = { docs, methods: {} }

    for (const [method, { checksum, payload, args, docs }] of Object.entries(
      methods,
    )) {
      const types = `RuntimeDescriptor<${args}, ${payload}>`
      const varName = `RuntimeApi${namespace}${method}`
      runtimeDescriptors[namespace].methods[method] = { types, varName, docs }
      addTypeImport(args)
      addTypeImport(payload)
      addLine(`const ${varName}: ${types} = "${checksum}" as ${types}`)
    }
  }

  addLine("")
  addLine("")

  addLine(
    `type I${key}DescriptorsPallets = ${customStringifyObject(
      mapObject(pallets, (_, key) =>
        [
          stgDescriptors,
          txDescriptors,
          evDescriptors,
          errDescriptors,
          constDescriptors,
        ].map((x) => docsCodegen(x[key])),
      ),
    )};\n`,
  )

  addLine(
    `type I${key}DescriptorsApis = ${customStringifyObject(
      docsCodegen(
        mapObject(runtimeDescriptors, (descriptor) => ({
          docs: descriptor.docs,
          types: docsCodegen(descriptor.methods),
        })),
      ),
    )};\n`,
  )

  const assetIdType = `PlainDescriptor<${asset?.type ?? "void"}>`
  const assetIdVarName = "ChargeAssetTxPaymentAsset"
  addLine(
    `const ${assetIdVarName}: ${assetIdType} = "${
      asset?.checksum ?? ""
    }" as ${assetIdType}`,
  )

  addLine(
    `type I${key}Descriptors = { pallets: I${key}DescriptorsPallets, apis: I${key}DescriptorsApis, asset: ${assetIdType} };\n`,
  )

  addLine(
    `const _allPalletDescriptors: I${key}DescriptorsPallets = ${customStringifyObject(
      mapObject(pallets, (_, key) =>
        [
          stgDescriptors,
          txDescriptors,
          evDescriptors,
          errDescriptors,
          constDescriptors,
        ].map((x) => mapObject(x[key], (v) => v.varName)),
      ),
    )};\n`,
  )

  addLine(
    `const _allApiDescriptors: I${key}DescriptorsApis = ${customStringifyObject(
      mapObject(runtimeDescriptors, (api) =>
        mapObject(api.methods, (method) => method.varName),
      ),
    )};\n`,
  )

  addLine(
    `const _allDescriptors: I${key}Descriptors = { pallets: _allPalletDescriptors, apis: _allApiDescriptors, asset: ${assetIdVarName} }`,
  )

  addLine(`export default _allDescriptors`)
  addLine(`export type Queries = QueryFromDescriptors<I${key}Descriptors>`)
  addLine(`export type Calls = TxFromDescriptors<I${key}Descriptors>`)
  addLine(`export type Events = EventsFromDescriptors<I${key}Descriptors>`)
  addLine(`export type Errors = ErrorsFromDescriptors<I${key}Descriptors>`)
  addLine(`export type Constants = ConstFromDescriptors<I${key}Descriptors>`)
  addLine(``)

  enums.forEach((x) => {
    addLine(`export type ${x} = _E${x};`)
    addLine(`export const ${x} = _Enum as unknown as GetEnum<${x}>;`)
  })

  const descriptorCodegen =
    knownImports
      .concat(
        `import type {${keyTypesImports.join(", ")}} from "./${key}-types"
import type {${enums
          .map((n) => `${n} as _E${n}`)
          .join(",")}} from "./${key}-types"
`,
      )
      .join(";\n") +
    "\n\n" +
    code.join("\n")

  await fs.writeFile(`${outputFolder}/${key}.ts`, descriptorCodegen)

  // Run tsc again to make sure the final .ts file has no compile errors
  {
    const tscFileName = path.join(outputFolder, key)
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
  }
}
