import pkg from "./package.json" assert { type: "json" }
import typescript from "rollup-plugin-typescript2"

/** @type {import('rollup').RollupOptions} */
const options = {
  input: "src/index.ts",
  output: [
    { file: pkg.main, format: "cjs" },
    { file: pkg.module, format: "es" },
  ],
  plugins: [typescript()],
  external: [
    ...Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies }),
    "fs",
    "path",
  ],
}

export default options
