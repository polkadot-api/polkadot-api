#!/usr/bin/env node
import { program } from "@commander-js/extra-typings"
import { generateDocs } from "@/generateDocs"

program.name("papi-generate-docs").description("Polkadot API docs generator")

program
  .description("Generate docs")
  .option("--config <filename>", "Source for the config file")
  .option("--output <directory>", "Output directory", "docs")
  .action(generateDocs)

program.parse()
