import { Option, program } from "@commander-js/extra-typings"
import type { add, generate, ink, remove, update } from "./commands"
import * as knownChains from "@polkadot-api/known-chains"

export type Commands = {
  add: typeof add
  generate: typeof generate
  remove: typeof remove
  update: typeof update
  ink: typeof ink
  version: string
}

export function getCli({
  add,
  generate,
  remove,
  update,
  ink,
  version,
}: Commands) {
  program.name("polkadot-api").description("Polkadot API CLI").version(version)

  const config = new Option("--config <filename>", "Source for the config file")
  const skipCodegen = new Option(
    "--skip-codegen",
    "Skip running codegen after adding",
  )
  const whitelist = new Option(
    "--whitelist <filename>",
    "Use whitelist file to reduce descriptor size",
  )

  program
    .command("generate", {
      isDefault: true,
    })
    .description("Generate descriptor files")
    .addOption(config)
    .addOption(whitelist)
    .action(generate)

  program
    .command("add")
    .description("Add a new chain spec to the list")
    .argument("<key>", "Key identifier for the chain spec")
    .addOption(config)
    .option("-f, --file <filename>", "Source from metadata encoded file")
    .option("-w, --wsUrl <URL>", "Source from websocket url")
    .option("-c, --chainSpec <filename>", "Source from chain spec file")
    .addOption(
      new Option("-n, --name <name>", "Source from a well-known chain").choices(
        Object.keys(knownChains),
      ),
    )
    .option("--wasm <filename>", "Source from runtime wasm file")
    .option(
      "--at <block hash or number>",
      "Only for -w/--wsUrl. Fetch the metadata for a specific block or hash",
    )
    .option("--no-persist", "Do not persist the metadata as a file")
    .addOption(skipCodegen)
    .addOption(whitelist)
    .action(add)

  program
    .command("update")
    .description("Update the metadata files and generate descriptor files")
    .argument(
      "[keys]",
      "Keys of the metadata files to update, separated by commas. Leave empty for all",
    )
    .addOption(config)
    .addOption(skipCodegen)
    .addOption(whitelist)
    .action(update)

  program
    .command("remove")
    .description("Remove a chain spec from the list")
    .argument("<key>", "Key identifier for the chain spec")
    .addOption(config)
    .addOption(skipCodegen)
    .addOption(whitelist)
    .action(remove)

  const inkCommand = program
    .command("ink")
    .description("Add, update or remove ink contracts")
  inkCommand
    .command("add")
    .description("Add or update an ink contract")
    .argument("<file>", ".contract or .json metadata file for the contract")
    .option("-k, --key <key>", "Key identifier for the contract")
    .addOption(config)
    .addOption(skipCodegen)
    .addOption(whitelist)
    .action(ink.add)
  inkCommand
    .command("remove")
    .description("Remove an ink contract")
    .argument("<key>", "Key identifier for the contract to remove")
    .addOption(config)
    .addOption(skipCodegen)
    .addOption(whitelist)
    .action(ink.remove)

  return program
}
