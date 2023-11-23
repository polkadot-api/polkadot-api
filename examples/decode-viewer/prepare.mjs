import { readFile, writeFile } from "node:fs/promises"
import { v14 } from "@polkadot-api/substrate-bindings"

const metadataBytes = await readFile("./ksm.scale")
const metadata = v14.dec(metadataBytes)
await writeFile("./src/metadata.txt", JSON.stringify(metadata))
