import recast from "recast"
import MagicString from "magic-string"
import type { Node } from "estree"
import fs from "fs"
import path from "path"
import type { ModuleInfo, Plugin } from "rollup"
import { astSymbolTracker } from "./astSymbolTracker"
import { applyWhitelist } from "./whitelist"

const DEFAULT = Symbol("default")
type DEFAULT = typeof DEFAULT

export default function descriptorTreeShake(codegenFolder: string): Plugin {
  let codegenFiles: string[] = []
  let pApiClient: string = ""

  const entryPoints: string[] = []
  let detectedPaths: Paths = {}

  return {
    name: "descriptorTreeShake",
    async buildStart() {
      // Reset state
      entryPoints.length = 0
      detectedPaths = {}

      // On build start we resolve the ids of the entry files: polkadot-api and
      // generated code.
      const files = await new Promise<string[]>((resolve, reject) => {
        fs.readdir(codegenFolder, (err, files) => {
          if (err) return reject(err)
          resolve(
            files
              .filter((file) => !file.endsWith(".d.ts") && file.endsWith(".ts"))
              .map((name) => path.join(codegenFolder, name)),
          )
        })
      })
      const resolved = await Promise.all(
        files.map((file) => this.resolve(file)),
      )
      codegenFiles = resolved.filter(Boolean).map((result) => result!.id)

      const papiClientResolution = await this.resolve("@polkadot-api/client")
      if (!papiClientResolution) {
        throw new Error("Can't find module @polkadot-api/client")
      }
      pApiClient = papiClientResolution.id
    },
    moduleParsed(moduleInfo: ModuleInfo) {
      // If the module is importing one of the entry files, it's marked as an entry point.
      if (
        codegenFiles.some((id) => moduleInfo.importedIds.includes(id)) ||
        moduleInfo.importedIds.includes(pApiClient)
      ) {
        entryPoints.push(moduleInfo.id)
      }
    },
    buildEnd() {
      type SymbolMetadata =
        | { type: "clientNamespace" | "createClientSymbol" }
        | { type: "generatedSymbol" | "clientSymbol"; file: string }
        | { type: "path"; file: string; path: string[] }
      type Exports = Partial<Record<string | DEFAULT, SymbolMetadata>>
      type ImportMetadata =
        | {
            type: "client"
          }
        | {
            type: "generated"
            file: string
          }
        | {
            type: "external"
            exports: Exports
          }

      // Map from moduleId to the interesting symbols it's exporting
      const resolvedExports: Record<string, Exports> = {}

      // Traverse one file by moduleId. Returns the paths to be whitelisted
      // and the list of modules that import it if it's exporting something interesting
      const traverse = (
        id: string,
      ): {
        paths: Paths
        importers: readonly string[]
      } => {
        const root = this.getModuleInfo(id)
        if (!root) {
          throw new Error(`Module "${id}" not found`)
        }
        if (!root.ast) {
          return {
            paths: {},
            importers: [],
          }
        }

        const result = readAst(
          root.ast as Node,
          // We're passing in the list of imports as resolved by Rollup.
          // TODO better way of doing this? Problem is ast doesn't have names
          // resolved, so we have to rely on import order.
          root.importedIdResolutions.map(
            (resolution): ImportMetadata | null => {
              if (resolution.id === pApiClient) {
                return {
                  type: "client",
                }
              }
              if (codegenFiles.some((id) => id === resolution.id)) {
                return {
                  type: "generated",
                  file: resolution.id,
                }
              }
              if (resolvedExports[resolution.id]) {
                return {
                  type: "external",
                  exports: resolvedExports[resolution.id],
                }
              }
              return null
            },
          ),
        )

        resolvedExports[id] = {
          ...(resolvedExports[id] ?? {}),
          ...result.exports,
        }

        return {
          paths: result.paths,
          importers: Object.keys(result.exports).length ? root.importers : [],
        }
      }

      // Read the AST of a root file, and return the detected paths and exports.
      const readAst = (
        rootAst: Node,
        importMetadata: Array<ImportMetadata | null>,
      ) => {
        const paths: Paths = {}
        const exports: Exports = {}
        astSymbolTracker<SymbolMetadata>(rootAst, {
          importSymbol(index, imported) {
            // Plugin would allow us to re-resolve the import name, but it's async.
            // need to benchmark implications of this
            // pluginCtx
            //   .resolve(file, id)
            //   .then((r) => console.log(file, "resolved", r));

            const importMeta = importMetadata[index]
            if (!importMeta) return null

            switch (importMeta.type) {
              case "client":
                // e.g. import * as pApiClient from '@polkadot-api/client'
                if (imported.type === "namespace") {
                  return {
                    type: "clientNamespace",
                  }
                }
                // e.g. import { createClient } from '@polkadot-api/client'
                if (
                  imported.type === "named" &&
                  imported.name === "createClient"
                ) {
                  return {
                    type: "createClientSymbol",
                  }
                }
                return null
              case "generated":
                // We only care about default import here
                // e.g. import descriptors from "./codegen/test"
                if (imported.type === "default") {
                  return {
                    type: "generatedSymbol",
                    file: importMeta.file,
                  }
                }
                return null
              case "external":
                // This import is from a file we have already parsed and know
                // which "interesting" symbols is exporting.
                if (imported.type === "default") {
                  return importMeta.exports[DEFAULT] ?? null
                } else if (imported.type === "named") {
                  return importMeta.exports[imported.name] ?? null
                } else {
                  // TODO namespace
                  // similar case to `const somethingNested = { client }; somethingNested.client.tx.aa`
                  return null
                }
            }
          },
          memberAccess(symbol, property) {
            switch (symbol.type) {
              case "clientNamespace":
                // e.g. pApiClient.createClient
                return property === "createClient"
                  ? { type: "createClientSymbol" }
                  : null
              case "clientSymbol":
                // It's using the client, accessing the first prop
                // e.g. client.tx
                return { type: "path", file: symbol.file, path: [property] }
              case "path":
                // Any other subproperty
                // e.g. `client.tx.Pallet` => path: ['tx'], property: 'Pallet'
                if (symbol.path.length === 2) {
                  paths[symbol.file] = paths[symbol.file] ?? new Set()
                  paths[symbol.file].add([...symbol.path, property].join("."))
                  return null
                }
                return { ...symbol, path: [...symbol.path, property] }
            }
            return null
          },
          functionCall(symbol, args) {
            if (symbol.type !== "createClientSymbol") return null
            // e.g. createClient(chain, descriptors)
            const arg = args[1]
            if (!arg || arg.type !== "generatedSymbol") {
              // TODO graceful exit: warn and bail out from treeshaking
              throw new Error("Can't know which generated code it's using")
            }
            return {
              type: "clientSymbol",
              file: arg.file,
            }
          },
          exportSymbol(symbol, exported) {
            exports[exported.type === "default" ? DEFAULT : exported.name] =
              symbol
          },
        })

        return { paths, exports }
      }

      const filesToTraverse = new Set(entryPoints)
      const paths: Paths[] = []
      // filesToTraverse can grow as we're exploring and symbols are getting
      // exported and imported into other files.
      while (filesToTraverse.size) {
        const id = shiftSet(filesToTraverse)!
        const result = traverse(id)
        paths.push(result.paths)
        result.importers.forEach((id) => filesToTraverse.add(id))
      }
      detectedPaths = mergePaths(paths)
    },
    renderChunk(code, chunk) {
      // It would be better to do code transformations on `transform` hook, but
      // at that point we don't have all modules resolved and parsed. After
      // buildEnd hook, the only place we can do transforms are in `renderChunk`
      // In here we remove the unused paths.
      const modifications = Object.entries(detectedPaths)
        .map(([id, whitelist]) => {
          const targetModule = chunk.modules[id]
          if (!targetModule?.code) return null!

          const ast = recast.parse(targetModule.code)
          applyWhitelist(ast as Node, whitelist)
          const result = recast.print(ast)

          return [targetModule.code, result.code] as const
        })
        .filter(Boolean)

      if (!modifications.length) return null

      const codeMs = new MagicString(code)
      modifications.forEach(([oldCode, newCode]) => {
        codeMs.replace(oldCode, newCode)
      })

      return {
        code: codeMs.toString(),
        map: codeMs.generateMap({}),
      }
    },
  }
}

type Paths = Record<string, Set<string>>
function mergePaths(paths: Array<Paths>) {
  return paths.reduce((acc, paths) => {
    Object.entries(paths).forEach(([id, pathSet]) => {
      acc[id] = acc[id] ? new Set([...acc[id], ...pathSet]) : pathSet
    })
    return acc
  }, {} as Paths)
}

function shiftSet<T>(set: Set<T>) {
  for (const value of set) {
    set.delete(value)
    return value
  }
  return
}
