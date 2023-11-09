// This entry forces tsup (or esbuild) to code split "@polkadot-api/light-client-extension-helpers/chain-specs"
//
// Simarly, with Rollup, code splitting could be configured using output.manualChunks
//
//   export default {
//     input: "src/background.ts",
//     output: {
//       format: "esm",
//       dir: "dist/js/background",
//       manualChunks: {
//         smoldot: ["smoldot"],
//         helpers: ["@polkadot-api/light-client-extension-helpers/chain-specs"],
//       },
//     },
//     plugins: [pluginNodeResolve(), pluginEsbuild()],
//   }

import "@polkadot-api/light-client-extension-helpers/chain-specs"
