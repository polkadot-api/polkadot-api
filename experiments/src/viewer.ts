import { getKsmMetadata } from "@polkadot-api/metadata-fixtures"
import { getViewBuilder } from "@polkadot-api/view-builder"

const metadata = await getKsmMetadata("../packages/metadata-fixtures/src")

const { callDecoder } = getViewBuilder(metadata)
const start = Date.now()
const result = callDecoder(
  "0x180008040700dc97b0271418c41f80d049826cfb1d6bd2e44e11ea39759addf6b01632ca973d0b00409452a30306050400dc97b0271418c41f80d049826cfb1d6bd2e44e11ea39759addf6b01632ca973d",
  // "0x040700dc97b0271418c41f80d049826cfb1d6bd2e44e11ea39759addf6b01632ca973d0f00c0652095e59d",
)
const end = Date.now()

delete (result.args as any).shape

console.log(
  JSON.stringify(
    result,
    (_, v) => (typeof v === "bigint" ? v.toString() : v),
    2,
  ),
)

console.log(end - start)
