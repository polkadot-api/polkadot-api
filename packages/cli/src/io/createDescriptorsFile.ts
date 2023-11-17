import { PalletData } from "./types"
import fs from "fs/promises"
import { ESLint } from "eslint"
import { primitiveTypes } from "@polkadot-api/substrate-codegen"
import fsExists from "fs.promises.exists"
import tsc from "tsc-prog"
import path from "path"

export const createDescriptorsFile = async (
  key: string,
  outputFolder: string,
  pallets: Record<string, PalletData>,
  exports: Set<string>,
) => {
  let descriptorCodegen = ""

  descriptorCodegen += `import type { ArgsWithPayloadCodec, PlainDescriptor, TxDescriptor, StorageDescriptor, DescriptorCommon } from "@polkadot-api/substrate-bindings"\n`
  descriptorCodegen += `import {getPalletCreator} from "@polkadot-api/substrate-bindings"\n`

  descriptorCodegen += `import type {${[...exports]
    .filter((x) => !primitiveTypes[x as keyof typeof primitiveTypes])
    .map((v) => `I${v}`)
    .join(", ")}} from "./${key}-types.ts"\n\n`

  descriptorCodegen += `let NOTIN: any\n\n`

  const getPayloadType = (payload: string) =>
    primitiveTypes[payload as keyof typeof primitiveTypes] ?? `I${payload}`

  const errorDescriptors: [string, string][] = []
  const eventDescriptors: [string, string][] = []
  const constDescriptors: [string, string][] = []
  const stgDescriptors: [string, string][] = []
  const txDescriptors: [string, string][] = []
  for (const [
    pallet,
    { errors, events, constants, storage, tx },
  ] of Object.entries(pallets)) {
    descriptorCodegen += `const [_${pallet}P, _${pallet}S, _${pallet}T] = getPalletCreator(\"${pallet}\")\n\n`

    for (const [errorName, { checksum, payload }] of Object.entries(errors)) {
      const errType = getPayloadType(payload)
      const types = `PlainDescriptor<DescriptorCommon<"${pallet}", "${errorName}">, ${errType}>`
      const varName = `Err${pallet}${errorName}`
      descriptorCodegen += `const ${varName}: ${types} = _${pallet}P("${checksum}", "${errorName}", NOTIN as ${errType})\n`
      errorDescriptors.push([varName, types])
    }
    descriptorCodegen += `\n`

    for (const [evName, { checksum, payload }] of Object.entries(events)) {
      const evType = getPayloadType(payload)
      const types = `PlainDescriptor<DescriptorCommon<"${pallet}", "${evName}">, ${evType}>`
      const varName = `Ev${pallet}${evName}`
      descriptorCodegen += `const ${varName}: ${types} = _${pallet}P("${checksum}", "${evName}", NOTIN as ${evType})\n`
      eventDescriptors.push([varName, types])
    }
    descriptorCodegen += `\n`

    for (const [constName, { checksum, payload }] of Object.entries(
      constants,
    )) {
      const constType = getPayloadType(payload)
      const types = `PlainDescriptor<DescriptorCommon<"${pallet}", "${constName}">, ${constType}>`
      const varName = `Const${pallet}${constName}`
      descriptorCodegen += `const ${varName}: ${types} = _${pallet}P("${checksum}", "${constName}", NOTIN as ${constType})\n`
      constDescriptors.push([varName, types])
    }
    descriptorCodegen += `\n`

    for (const [txName, { checksum, payload }] of Object.entries(tx)) {
      const txType = getPayloadType(payload)
      const types = `TxDescriptor<DescriptorCommon<"${pallet}", "${txName}">, ${txType}>`
      const varName = `Tx${pallet}${txName}`
      descriptorCodegen += `const ${varName}: ${types} = _${pallet}T("${checksum}", "${txName}", NOTIN as ${txType})\n`
      txDescriptors.push([varName, types])
    }
    descriptorCodegen += `\n`

    for (const [
      stgName,
      { checksum, payload, key, isOptional, len },
    ] of Object.entries(storage)) {
      const keyType = getPayloadType(key)
      const valueType = getPayloadType(payload)
      const types = `StorageDescriptor<
DescriptorCommon<"${pallet}", "${stgName}">,
ArgsWithPayloadCodec<${keyType}, ${valueType}>
>`
      const varName = `Stg${pallet}${stgName}`
      descriptorCodegen += `const ${varName}: ${types} = _${pallet}S("${checksum}", "${stgName}", NOTIN as ${keyType}, NOTIN as ${valueType}, ${len}, ${
        isOptional ? 0 : 1
      })\n`
      stgDescriptors.push([varName, types])
    }
    descriptorCodegen += `\n\n`
  }
  descriptorCodegen += `\n\n`

  descriptorCodegen += `type ITxDescriptors = [${txDescriptors
    .map(([, x]) => x)
    .join(", ")}];
const _allTxDescriptors: ITxDescriptors = [${txDescriptors
    .map(([x]) => x)
    .join(", ")}]\n`

  descriptorCodegen += `type IStgDescriptors = [${stgDescriptors
    .map(([, x]) => x)
    .join(", ")}];
const _allStgDescriptors: IStgDescriptors = [${stgDescriptors
    .map(([x]) => x)
    .join(", ")}]\n`

  descriptorCodegen += `type IConstDescriptors = [${constDescriptors
    .map(([, x]) => x)
    .join(", ")}];
const _allConstDescriptors: IConstDescriptors = [${constDescriptors
    .map(([x]) => x)
    .join(", ")}]\n`

  descriptorCodegen += `type IEvtDescriptors = [${eventDescriptors
    .map(([, x]) => x)
    .join(", ")}];
const _allEvtDescriptors: IEvtDescriptors = [${eventDescriptors
    .map(([x]) => x)
    .join(", ")}]\n`

  descriptorCodegen += `type IErrDescriptors = [${errorDescriptors
    .map(([, x]) => x)
    .join(", ")}];
const _allErrDescriptors: IErrDescriptors = [${errorDescriptors
    .map(([x]) => x)
    .join(", ")}]\n`

  descriptorCodegen += `type IAllDescriptors = [IStgDescriptors, ITxDescriptors, IEvtDescriptors, IErrDescriptors, IConstDescriptors];
const _allDescriptors: IAllDescriptors = [
    _allStgDescriptors,
    _allTxDescriptors,
    _allEvtDescriptors,
    _allErrDescriptors,
    _allConstDescriptors
  ]\n`
  descriptorCodegen += `export default _allDescriptors`

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

    if (await fsExists(`${tscFileName}.d.ts`)) {
      await fs.rm(`${tscFileName}.d.ts`)
    }
  }
}
