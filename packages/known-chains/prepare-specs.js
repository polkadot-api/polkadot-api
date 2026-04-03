import { mkdir, readFile, readdir, writeFile } from "node:fs/promises"
import { join } from "node:path"

const specFiles = await readdir("specs")
await mkdir(join("src", "specs"), { recursive: true })

for (const filename of specFiles) {
  const packageName = filename.replace(".json", "")
  const fileContent = await readFile(join("specs", filename), "utf-8")

  await writeFile(
    join("src", "specs", `${packageName}.ts`),
    `export const chainSpec: string = \`${fileContent}\`\n`,
  )
}
