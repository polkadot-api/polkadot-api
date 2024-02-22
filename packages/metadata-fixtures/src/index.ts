import { V15, v15 } from "@polkadot-api/substrate-bindings"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

export async function getKsmMetadataBuffer() {
  const buffer = await readFile(join(__dirname, "../ksm-metadata.scale"))
  return new Uint8Array(buffer)
}
export async function getKsmMetadata(): Promise<V15> {
  const buffer = await getKsmMetadataBuffer()
  return v15.dec(buffer)
}
