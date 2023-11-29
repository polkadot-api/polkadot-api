import { getViewBuilder } from "@polkadot-api/substrate-codegen"
import { readFile } from "node:fs/promises"
import {
  metadata as $metadata,
  CodecType,
  OpaqueCodec,
} from "@polkadot-api/substrate-bindings"

type Metadata = CodecType<typeof $metadata>["metadata"]

const metadataBytes = await readFile("./ksm-metadata.scale")
const { inner } = OpaqueCodec($metadata).dec(metadataBytes)
const { metadata } = inner()

assertIsV14(metadata)

const { callDecoder } = getViewBuilder(metadata.value)
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

function assertIsV14(
  metadata: Metadata,
): asserts metadata is Metadata & { tag: "v14" } {
  if (metadata.tag !== "v14") {
    throw new Error("unreachable")
  }
}
