import dts from "rollup-plugin-dts"
import esbuild from "rollup-plugin-esbuild"
import alias from "@rollup/plugin-alias"
import json from "@rollup/plugin-json"
import path from "path"
import { readdir } from "node:fs/promises"
import { chmodSync, statSync } from "node:fs"
import resolve from "@rollup/plugin-node-resolve"

const reexports = (await readdir("reexports"))
  .filter((v) => v.endsWith(".ts"))
  .map((v) => `reexports/` + v)

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

const getUmdPackage = (input) => {
  if (input === "src/index.ts")
    return {
      name: "papi",
      file: "dist/umd/index.min.js",
      format: "umd",
    }
  const fixedInput = input.replace("reexports/", "").replace(".ts", "")
  const name = fixedInput
    .replace(/[-_]./g, (match) => match[1].toUpperCase())
    .replace(/^./g, (match) => match.toUpperCase())
  return {
    name: `papi${name[0].toUpperCase()}${name.slice(1)}`,
    file: `dist/umd/${fixedInput}.min.js`,
    format: "umd",
  }
}

export default [
  {
    ...commonOptions,
    plugins: [absoluteAlias, esbuild()],
    output: [
      {
        dir: `dist`,
        format: "cjs",
        sourcemap: true,
        preserveModules: true,
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
    plugins: [absoluteAlias, dts()],
    output: {
      dir: `dist`,
      format: "es",
    },
  },
  ...commonOptions.input
    // smoldot has issues with `this` ocurrencies
    // we don't bundle smoldot and chainspecs
    // do not include `node` websocket neither
    .filter(
      (v) =>
        !v.includes("sm-provider") &&
        !v.includes("smoldot") &&
        !v.includes("chains"),
    )
    .map((n) => ({
      input: n,
      external: () => false,
      plugins: [absoluteAlias, resolve(), esbuild({ minify: true })],
      output: getUmdPackage(n),
    })),
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
