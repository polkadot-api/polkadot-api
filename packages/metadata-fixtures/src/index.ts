import { V15, v15 } from "@polkadot-api/substrate-bindings"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

export async function getKsmMetadataBuffer(baseFolder?: string) {
  const buffer = await readFile(
    join(baseFolder ?? __dirname, "../ksm-metadata.scale"),
  )
  return new Uint8Array(buffer)
}
export async function getKsmMetadata(baseFolder?: string): Promise<V15> {
  const buffer = await getKsmMetadataBuffer(baseFolder)
  return v15.dec(buffer)
}
