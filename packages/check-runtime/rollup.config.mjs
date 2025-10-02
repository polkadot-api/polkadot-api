import dts from "rollup-plugin-dts"
import esbuild from "rollup-plugin-esbuild"
import alias from "@rollup/plugin-alias"
import json from "@rollup/plugin-json"
import path from "path"
import { chmodSync, statSync } from "node:fs"
import resolve from "@rollup/plugin-node-resolve"

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

export default [
  {
    input: `src/index.ts`,
    external: (id) => !/^[./]/.test(id) && !/^@\//.test(id),
    plugins: [esbuild()],
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
    input: `src/index.ts`,
    external: (id) => !/^[./]/.test(id) && !/^@\//.test(id),
    plugins: [dts()],
    output: {
      dir: `dist`,
      format: "es",
    },
  },
  {
    input: "src/cli.ts",
    external: (id) => !/^[./]/.test(id) && !/^@\//.test(id),
    plugins: [
      absoluteAlias,
      json(),
      esbuild(),
      {
        // seems rollup-plugin-executable is not compatible with latest rollup version.
        writeBundle(options, entries) {
          Object.values(entries)
            .filter((v) => v.fileName.endsWith("js"))
            .forEach((v) => {
              const file = path.join(options.dir, v.fileName)
              chmodSync(file, statSync(file).mode | 0o111)
            })
        },
      },
    ],
    output: {
      dir: `bin`,
      format: "es",
      sourcemap: true,
      entryFileNames: "[name].mjs",
    },
  },
]
