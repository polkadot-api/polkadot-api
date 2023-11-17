import fsExists from "fs.promises.exists"
import tsc from "tsc-prog"
import fs from "fs/promises"
import path from "path"
import { CodeDeclarations } from "@polkadot-api/substrate-codegen"

export const createDtsFile = async (
  key: string,
  dest: string,
  declarations: CodeDeclarations,
) => {
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
    } else if (!variable.types && tupleMatch && tupleMatch[0]) {
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

  const tscFileName = path.join(dest, key)
  const tscTypesFileName = path.join(dest, `${key}-types`)

  if (await fsExists(`${tscTypesFileName}.d.ts`)) {
    await fs.rm(`${tscTypesFileName}.d.ts`)
  }
  if (await fsExists(`${tscFileName}.ts`)) {
    await fs.rm(`${tscFileName}.ts`)
  }

  await fs.writeFile(`${tscTypesFileName}.ts`, constDeclarations.join("\n\n"))

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
