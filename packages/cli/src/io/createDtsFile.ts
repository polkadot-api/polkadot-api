import fsExists from "fs.promises.exists"
import tsc from "tsc-prog"
import fs from "fs/promises"
import path from "path"

export const createDtsFile = async (
  key: string,
  dest: string,
  code: string,
) => {
  const tscFileName = path.join(dest, key)
  const tscTypesFileName = path.join(dest, `${key}-types`)

  if (await fsExists(`${tscTypesFileName}.d.ts`)) {
    await fs.rm(`${tscTypesFileName}.d.ts`)
  }
  if (await fsExists(`${tscFileName}.ts`)) {
    await fs.rm(`${tscFileName}.ts`)
  }

  await fs.writeFile(`${tscTypesFileName}.ts`, code)

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
