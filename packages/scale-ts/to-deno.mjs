import { fileURLToPath } from "url"
import { readdir, copyFile, mkdir, writeFile, readFile } from "fs/promises"
import { extname, join, dirname } from "path"
import { parse, print, types } from "recast"
import parser from "recast/parsers/typescript.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const findFiles = async (folderPath) => {
  let files = []
  let folders = []

  const content = await readdir(folderPath, { withFileTypes: true })
  for (const file of content) {
    if (file.isFile()) {
      files.push(join(folderPath, file.name))
    } else {
      folders.push(join(folderPath, file.name))
    }
  }

  const innerFiles = await Promise.all(folders.map(findFiles))
  return files.concat(innerFiles.flat())
}

const options = [
  ".ts",
  ".tsx",
  ".d.ts",
  "/index.ts",
  "/index.tsx",
  "/index.d.ts",
]

const fixImportExport = (fileName, availableFiles, value) => {
  if (extname(value)) return value
  const base = join(dirname(fileName), value)
  const extension = options.find((option) =>
    availableFiles.has(
      option.startsWith("/") ? join(base, option) : base + option,
    ),
  )
  return extension.startsWith("/") ? join(value, extension) : value + extension
}

const declarationTypes = new Set([
  "ImportDeclaration",
  "ExportAllDeclaration",
  "ExportNamedDeclaration",
])

const transformFile = async (fileName, availableFiles) => {
  const b = types.builders
  const fileContent = await readFile(fileName)
  const tsAst = parse(fileContent, {
    parser,
  })
  tsAst.program.body
    .filter((x) => declarationTypes.has(x.type) && x.source)
    .forEach((current) => {
      current.source = b.stringLiteral(
        fixImportExport(fileName, availableFiles, current.source.value),
      )
    })
  return print(tsAst).code
}

const _copyFile = async (from, to) => {
  await mkdir(dirname(to), { recursive: true })
  await copyFile(from, to)
}

const transformAndCopyFile = async (from, to, availableFiles) => {
  const [enhancedCode] = await Promise.all([
    transformFile(from, availableFiles),
    mkdir(dirname(to), { recursive: true }),
  ])
  await writeFile(to, enhancedCode)
}

const tsExtensions = new Set([".ts", ".tsx"])

;(async () => {
  const src = join(__dirname, "./src")
  const filesList = await findFiles(src)
  const availableFiles = new Set(filesList)
  const srcBase = join(__dirname, "./src")
  const denoBase = join(__dirname, "./.deno")

  const fromToList = filesList.map((fromFile) => {
    const targetFile = fromFile.replace(srcBase, denoBase)
    return [fromFile, targetFile]
  })

  await Promise.all(
    fromToList.map(([from, to]) =>
      tsExtensions.has(extname(from))
        ? transformAndCopyFile(from, to, availableFiles)
        : _copyFile(from, to),
    ),
  )

  return copyFile(join(srcBase, "../README.md"), join(denoBase, "./README.md"))
})()
