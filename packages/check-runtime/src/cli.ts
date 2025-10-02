#!/usr/bin/env node

import { program } from "@commander-js/extra-typings"
import { getProblems } from "./get-problems"
import { HexString } from "polkadot-api"
import { toHex } from "polkadot-api/utils"
import { readFile } from "node:fs/promises"
import { Problem } from "./problems"
import { version } from "../package.json"

function getCli() {
  program
    .name("check-runtime")
    .description("Check for common runtime issues")
    .version(version)

  program
    .command("problems")
    .description("Find problems")
    .argument("<uri>", "A WebSocket URI pointing to an RPC of the chain")
    .option(
      "--wasm <filenameOrUrl>",
      "Either the local path, or the URL from where to pull the WASM",
    )
    .option("--at <block>", "At which height to check and/or apply the WASM")
    .option(
      "--symbol <symbol>",
      "The symbol of the native token. If not provided, it will be obtained from the RPC chainspec",
    )
    .option(
      "--decimals <decimals>",
      "The number of decimals of the native token. If not provided, it will be obtained from the RPC chainspec",
    )
    .action(async (uri, options) => {
      let wasm: HexString | undefined = undefined
      if (options.wasm) {
        let isFile: boolean
        try {
          new URL(options.wasm)
          isFile = true
        } catch {
          isFile = false
        }

        if (isFile) {
          console.log("Downloading the WASM file...")
          wasm = toHex(await (await fetch(options.wasm)).bytes())
        } else {
          console.log("Loading WASM file...")
          wasm = toHex(new Uint8Array(await readFile(options.wasm)))
        }
      }

      console.log(`Checking for common problems. This may take a while...`)
      const problems = await getProblems(uri, {
        wasm,
        block: options.at,
        token: {
          decimals:
            options.decimals !== undefined
              ? Number(options.decimals)
              : undefined,
          symbol: options.symbol,
        },
      })

      const messages: Record<Problem, string> = {
        [Problem.ANCIENT_METADATA]:
          "This runtime doesn't expose a modern (>=14) metadata",
        [Problem.MISSING_RUNTIME_APIS]: `The runtime APIs are missing. Plese have a look at this: https://github.com/polkadot-api/polkadot-api/issues/1164#issuecomment-3332177905`,
        [Problem.MISSING_MODERN_METADATA]: `This runtime only exposes metadata v14.`,
        [Problem.MISSING_CHECK_METADATA_HASH_EXTENSION]: `The extrinsic doesn't support the CheckMetadataHash extension, therefore this runtime won't work well with transactions signed by offline devices`,
        [Problem.WRONG_OR_MISSING_METADATA_HASH]: `This runtime was not compiled with the proper metadata-hash, and thus transactions correctly using the CheckMetadataHash extension will be deemed invalid`,
        [Problem.DIFFERENT_METADATA_HASHES]: `The metadata-hash differs from metadata v15 and metadata v16`,
      }
      if (problems.length) {
        console.warn(
          `${problems.length > 1 ? "Some issues were found" : "An issue was found"} with this runtime:`,
        )
        problems.forEach((problem) => {
          console.warn(messages[problem])
        })
        process.exit(1)
      }
      console.log("Everything looks great!")
      process.exit(0)
    })

  return program
}

getCli().parse()
