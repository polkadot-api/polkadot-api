import typescript from "@rollup/plugin-typescript"
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
    plugins: [typescript({ emitDeclarationOnly: true, outDir: "dist" })],
    output: {
      dir: "dist",
      format: "es",
    },
  },
]
