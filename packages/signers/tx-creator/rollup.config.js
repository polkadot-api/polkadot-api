import dts from "rollup-plugin-dts"
import alias from "@rollup/plugin-alias"
import path from "path"
import resolve from "@rollup/plugin-node-resolve"

const commonOptions = {
  input: "src/index.ts",
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

export default [
  {
    ...commonOptions,
    plugins: [absoluteAlias, dts()],
    output: {
      file: `dist/index.d.ts`,
      format: "es",
    },
  },
]
