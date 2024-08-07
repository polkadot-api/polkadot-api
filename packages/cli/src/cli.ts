import { Option, program } from "@commander-js/extra-typings"
import type { add, generate, remove, update } from "./commands"
import * as knownChains from "@polkadot-api/known-chains"

export type Commands = {
  add: typeof add
  generate: typeof generate
  remove: typeof remove
  update: typeof update
}

export function getCli({ add, generate, remove, update }: Commands) {
  program.name("polkadot-api").description("Polkadot API CLI")

  const config = new Option("--config <filename>", "Source for the config file")

  program
    .command("generate", {
      isDefault: true,
    })
    .description("Generate descriptor files")
    .addOption(config)
    .option(
      "--whitelist <filename>",
      "Use whitelist file to reduce descriptor size",
    )
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
    .option("--no-persist", "Do not persist the metadata as a file")
    .option("--skip-codegen", "Skip running codegen after adding")
    .action(add)

  program
    .command("update")
    .description("Update the metadata files and generate descriptor files")
    .argument(
      "[keys]",
      "Keys of the metadata files to update, separated by commas. Leave empty for all",
    )
    .addOption(config)
    .option("--skip-codegen", "Skip running codegen after updating")
    .action(update)

  program
    .command("remove")
    .description("Remove a chain spec from the list")
    .argument("<key>", "Key identifier for the chain spec")
    .addOption(config)
    .option("--skip-codegen", "Skip running codegen after removing")
    .action(remove)

  return program
}
