import dts from "rollup-plugin-dts"
import esbuild from "rollup-plugin-esbuild"

const generateEntry = (entry) => [
  {
    input: `src/${entry}.ts`,
    external: (id) => !/^[./]/.test(id) && !/^@\//.test(id),
    plugins: [esbuild()],
    output: [
      {
        dir: `dist/${entry}`,
        format: "cjs",
        sourcemap: true,
      },
      {
        dir: `dist/${entry}/esm`,
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
    plugins: [dts()],
    output: {
      dir: `dist/${entry}`,
      format: "es",
    },
  },
]

export default [
  ...generateEntry("web"),
  ...generateEntry("node"),
  ...generateEntry("index"),
]
