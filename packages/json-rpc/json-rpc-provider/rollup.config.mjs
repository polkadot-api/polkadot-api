import dts from "rollup-plugin-dts"

const commonOptions = {
  input: "src/index.ts",
  external: (id) => !/^[./]/.test(id),
}

export default [
  {
    ...commonOptions,
    plugins: [dts()],
    output: {
      file: `dist/index.d.ts`,
      format: "es",
    },
  },
]
