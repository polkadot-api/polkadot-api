import dts from "rollup-plugin-dts"
import esbuild from "rollup-plugin-esbuild"

const generateEntry = (entry) => {
  const outDir = entry === "index" ? "dist" : "dist/" + entry
  return [
    {
      input: `src/${entry}.ts`,
      external: (id) => !/^[./]/.test(id) && !/^@\//.test(id),
      plugins: [esbuild()],
      output: [
        {
          dir: outDir,
          format: "cjs",
          sourcemap: true,
        },
        {
          dir: `${outDir}/esm`,
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
        dir: outDir,
        format: "es",
      },
    },
  ]
}

export default [
  ...generateEntry("index"),
  ...generateEntry("node-worker"),
  ...generateEntry("worker"),
  ...generateEntry("from-node-worker"),
  ...generateEntry("from-worker"),
]
