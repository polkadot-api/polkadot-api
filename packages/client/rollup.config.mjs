import dts from "rollup-plugin-dts"
import esbuild from "rollup-plugin-esbuild"
import alias from "@rollup/plugin-alias"
import path from "path"
import { readdir } from "node:fs/promises"
import resolve from "@rollup/plugin-node-resolve"

const reexports = (await readdir("src/reexports"))
  .filter((v) => v.endsWith(".ts"))
  .map((v) => `src/reexports/` + v)

const commonOptions = {
  input: ["src/index.ts", ...reexports],
  external: (id) => !/^[./]/.test(id) && !/^@\//.test(id),
}

const absoluteAlias = alias({
  entries: [
    {
      find: "@",
      // In tsconfig this would be like `"paths": { "@/*": ["./src/*"] }`
      replacement: path.resolve("./src"),
      customResolver: resolve({
        extensions: [".js", ".ts"],
      }),
    },
  ],
})

const dtsReexportPaths = {
  generateBundle: (v, b, i) => {
    Object.values(b).forEach((v) => {
      v.fileName = v.fileName.replace("src/", "")
      v.preliminaryFileName = v.preliminaryFileName.replace("src/", "")
    })
  },
}
const cjsReexportPaths = {
  generateBundle: (v, b, i) => {
    Object.values(b).forEach((v) => {
      if (
        (v.facadeModuleId
          ? v.facadeModuleId.includes("reexports")
          : v.fileName.endsWith(".js.map") && v.fileName !== "index.js.map") &&
        !v.fileName.includes("reexports")
      ) {
        v.fileName = "reexports/" + v.fileName
        v.preliminaryFileName = "reexports/" + v.preliminaryFileName
      }
    })
  },
}

export default [
  {
    ...commonOptions,
    plugins: [absoluteAlias, esbuild(), cjsReexportPaths],
    output: [
      {
        dir: `dist`,
        format: "cjs",
        sourcemap: true,
      },
      {
        dir: `dist/esm`,
        format: "es",
        sourcemap: true,
        preserveModules: true,
        entryFileNames: "[name].mjs",
      },
    ],
  },
  {
    ...commonOptions,
    plugins: [absoluteAlias, dts(), dtsReexportPaths],
    output: {
      dir: `dist`,
      format: "es",
    },
  },
  {
    input: "src/cli.ts",
    external: (id) => !/^[./]/.test(id) && !/^@\//.test(id),
    plugins: [absoluteAlias, esbuild()],
    output: {
      dir: `bin`,
      format: "es",
      sourcemap: true,
      entryFileNames: "[name].mjs",
    },
  },
]
