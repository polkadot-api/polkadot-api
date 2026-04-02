import alias from "@rollup/plugin-alias"
import json from "@rollup/plugin-json"
import resolve from "@rollup/plugin-node-resolve"
import path from "path"
import dts from "rollup-plugin-dts"
import esbuild from "rollup-plugin-esbuild"

export const absoluteAlias = alias({
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

export const generateEntry = (entry) => {
  const outDir = entry === "index" ? "dist" : "dist/" + entry
  return [
    {
      input: `src/${entry}.ts`,
      external: (id) => !/^[./]/.test(id) && !/^@\//.test(id),
      plugins: [absoluteAlias, json(), esbuild()],
      output: [
        {
          dir: outDir,
          format: "es",
          sourcemap: true,
          preserveModules: true,
          entryFileNames: "[name].mjs",
        },
      ],
    },
    {
      input: `src/${entry}.ts`,
      external: (id) => !/^[./]/.test(id) && !/^@\//.test(id),
      plugins: [absoluteAlias, dts()],
      output: {
        dir: outDir,
        format: "es",
      },
    },
  ]
}
