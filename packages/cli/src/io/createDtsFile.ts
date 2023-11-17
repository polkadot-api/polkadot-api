import fsExists from "fs.promises.exists"
import tsc from "tsc-prog"
import fs from "fs/promises"
import path from "path"
import { CodeDeclarations } from "@polkadot-api/substrate-codegen"

export const createDtsFile = async (
  key: string,
  dest: string,
  declarations: CodeDeclarations,
  exported: Set<string>,
) => {
  declarations.typeImports.add("Codec")

  const typeImports = `import type {${[...declarations.typeImports].join(
    ", ",
  )}} from "@polkadot-api/substrate-bindings";`
  const varImports = `import {${[...declarations.imports].join(
    ", ",
  )}} from "@polkadot-api/substrate-bindings";`

  const code = [...declarations.variables.values()].map((variable) => {
    return `${exported.has(variable.id) ? "export " : ""}type I${
      variable.id
    } = ${variable.types};
const ${variable.id}: Codec<I${variable.id}> = ${variable.value};
`
  })

  const codeStr = `${typeImports}
${varImports}

${code.join("\n\n")}
`

  const tscFileName = path.join(dest, key)
  const tscTypesFileName = path.join(dest, `${key}-types`)

  if (await fsExists(`${tscTypesFileName}.d.ts`)) {
    await fs.rm(`${tscTypesFileName}.d.ts`)
  }
  if (await fsExists(`${tscFileName}.ts`)) {
    await fs.rm(`${tscFileName}.ts`)
  }

  await fs.writeFile(`${tscTypesFileName}.ts`, codeStr)

  tsc.build({
    basePath: dest,
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

  await fs.rm(`${tscTypesFileName}.ts`)
}
