#!/usr/bin/env node

import { program } from "@commander-js/extra-typings"
import { getProblems } from "./get-problems"
import { HexString } from "polkadot-api"
import { toHex } from "polkadot-api/utils"
import { readFile } from "node:fs/promises"
import ora from "ora"
import { Problem } from "./problems"
import { version } from "../package.json"
const messages: Record<Problem, string> = {
  [Problem.ANCIENT_METADATA]:
    "This runtime doesn't expose a modern (>=14) metadata",
  [Problem.MISSING_RUNTIME_APIS]: `The runtime APIs are missing. Plese have a look at this: https://github.com/polkadot-api/polkadot-api/issues/1164#issuecomment-3332177905`,
  [Problem.DEV_APIS_PRESENT]: `The runtime has APIs that are only meant for development ("RunBenchmark" and/or "TryRuntime"). These APIs should not be present in a production build.`,
  [Problem.MISSING_MODERN_METADATA]: `This runtime only exposes metadata v14.`,
  [Problem.MISSING_CHECK_METADATA_HASH_EXTENSION]: `The extrinsic doesn't support the CheckMetadataHash extension, therefore this runtime won't work well with transactions signed by offline devices`,
  [Problem.WRONG_OR_MISSING_METADATA_HASH]: `This runtime was not compiled with the proper metadata-hash, and thus transactions correctly using the CheckMetadataHash extension will be deemed invalid`,
  [Problem.DIFFERENT_METADATA_HASHES]: `The metadata-hash differs from metadata v15 and metadata v16`,
}

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
        let isUri: boolean
        try {
          new URL(options.wasm)
          isUri = true
        } catch {
          isUri = false
        }

        if (isUri) {
          const spinner = ora("Downloading the WASM file...").start()
          try {
            wasm = toHex(await (await fetch(options.wasm)).bytes())
          } catch (e) {
            spinner.fail("There was a problem while downloading the WASM")
            throw e
          }
          spinner.succeed("The WASM file was successfully downloaded")
        } else {
          const spinner = ora("Loading WASM file from disk...").start()
          try {
            wasm = toHex(new Uint8Array(await readFile(options.wasm)))
          } catch (e) {
            spinner.fail("There was a problem loading the WASM file from disk")
            throw e
          }
        }
      }

      const spinner = ora(
        `Checking for common problems. This may take a while...`,
      ).start()
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

      if (problems.length) {
        spinner.fail(
          `${problems.length > 1 ? "Some issues were found" : "An issue was found"} with this runtime:`,
        )
        problems.forEach((problem) => {
          console.warn(messages[problem])
        })
        process.exit(1)
      }
      spinner.succeed("Everything looks great!")
      process.exit(0)
    })

  return program
}

getCli().parse()
