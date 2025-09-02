import dts from "rollup-plugin-dts"
import esbuild from "rollup-plugin-esbuild"

const commonOptions = {
  input: "src/index.ts",
  external: (id) => !/^[./]/.test(id),
}

export default [
  {
    ...commonOptions,
    plugins: [esbuild()],
    output: [
      {
        file: `dist/index.js`,
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
    plugins: [dts()],
    output: {
      file: `dist/index.d.ts`,
      format: "es",
    },
  },
]
