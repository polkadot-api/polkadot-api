/**
 * This script makes a consistent package.json throughout all packages Sets
 * type=module and configures `exports`
 *
 * Exceptions: `client` and `known-chains` have their own sync-packages script,
 * and `cli` has a different export structure.
 */

import { readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"

const config: Record<string, string[]> = {
  codegen: [],
  "compare-runtimes": [],
  "ink-contracts": [],
  "json-rpc/json-rpc-provider": [],
  "json-rpc/json-rpc-provider-proxy": [],
  "json-rpc/logs-provider": [],
  "json-rpc/sm-provider": [],
  "json-rpc/ws-middleware": [],
  "json-rpc/ws-provider": [],
  "merkleize-metadata": [],
  "metadata-builders": [],
  "metadata-compatibility": [],
  "metadata-fixtures": [],
  "observable-client": [],
  "raw-client": [],
  "react-builder": [],
  "signers/ledger-signer": [],
  "signers/meta-signers": [],
  "signers/pjs-signer": [],
  "signers/polkadot-signer": [],
  "signers/signer": [],
  "signers/signers-common": [],
  smoldot: ["from-node-worker", "from-worker", "node-worker", "worker"],
  "substrate-bindings": [],
  "substrate-client": [],
  "tx-utils": [],
  utils: [],
  "view-builder": [],
}

for (const path in config) {
  const exports = config[path]
  const packageJsonPath = join("packages", path, "package.json")
  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf-8"))

  packageJson.type = "module"
  packageJson.exports = {
    ".": {
      types: "./dist/index.d.ts",
      module: "./dist/index.js",
      import: "./dist/index.js",
      default: "./dist/index.js",
    },
    ...Object.fromEntries(
      exports.map((ex) => [
        `./${ex}`,
        {
          types: `./dist/${ex}/${ex}.d.ts`,
          module: `./dist/${ex}/${ex}.js`,
          import: `./dist/${ex}/${ex}.js`,
          default: `./dist/${ex}/${ex}.js`,
        },
      ]),
    ),
  }
  packageJson.main = "./dist/index.js"
  packageJson.module = "./dist/index.js"
  packageJson.browser = "./dist/index.js"
  packageJson.types = "./dist/index.d.ts"

  await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n")
}
