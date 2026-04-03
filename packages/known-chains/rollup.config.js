import { readdir } from "node:fs/promises"
import { join } from "node:path"
import { generateEntry } from "../../rollup_utils.js"

const specFiles = await readdir("./src/specs")
const entryPoints = specFiles
  .filter((s) => s.endsWith(".ts"))
  .map((s) => join("specs", s.replace(/\.ts$/, "")))
  .flatMap(generateEntry)

export default [...generateEntry("index"), ...entryPoints]
