import { getViewBuilder } from "@polkadot-api/substrate-codegen"
import { readFile } from "node:fs/promises"
import { v14 } from "@polkadot-api/substrate-bindings"

const metadataBytes = await readFile("./ksm.scale")
const metadata = v14.dec(metadataBytes)

const { callDecoder } = getViewBuilder(metadata)
const start = Date.now()
const result = callDecoder(
  "0x180008040700dc97b0271418c41f80d049826cfb1d6bd2e44e11ea39759addf6b01632ca973d0b00409452a30306050400dc97b0271418c41f80d049826cfb1d6bd2e44e11ea39759addf6b01632ca973d",
  // "0x040700dc97b0271418c41f80d049826cfb1d6bd2e44e11ea39759addf6b01632ca973d0f00c0652095e59d",
)
const end = Date.now()

const shape = result.args.shape
if (shape.codec !== "Struct") throw null

delete (result.args as any).shape

console.log(
  JSON.stringify(
    result,
    (_, v) => (typeof v === "bigint" ? v.toString() : v),
    2,
  ),
)

console.log(end - start)
