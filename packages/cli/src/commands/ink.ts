import { generateInkTypes } from "@polkadot-api/codegen"
import { getInkLookup } from "@polkadot-api/ink-contracts"
import * as fs from "node:fs/promises"

export async function ink(file: string) {
  const metadata = await fs.readFile(file, "utf-8")

  generateInkTypes(getInkLookup(JSON.parse(metadata)))
}
