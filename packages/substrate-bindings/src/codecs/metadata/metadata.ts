import {
  Bytes,
  type Codec,
  type CodecType,
  Enum,
  Option,
  Struct,
  Tuple,
  compact,
  createCodec,
  u32,
} from "scale-ts"
import type { HexString } from "../scale"
import { v14 } from "./v14"
import { v15 } from "./v15"
import { v16 } from "./v16"

const unsupportedFn = () => {
  throw new Error("Unsupported metadata version!")
}

const unsupported = createCodec(
  unsupportedFn,
  unsupportedFn,
) as unknown as Codec<unknown>

export const metadata = Struct({
  magicNumber: u32,
  metadata: Enum({
    v0: unsupported,
    v1: unsupported,
    v2: unsupported,
    v3: unsupported,
    v4: unsupported,
    v5: unsupported,
    v6: unsupported,
    v7: unsupported,
    v8: unsupported,
    v9: unsupported,
    v10: unsupported,
    v11: unsupported,
    v12: unsupported,
    v13: unsupported,
    v14,
    v15,
    v16,
  }),
})
export type Metadata = CodecType<typeof metadata>

const opaqueBytes = Bytes()
const optionOpaque = Option(opaqueBytes)
const opaqueOpaqueBytes = Tuple(compact, opaqueBytes)

export const decAnyMetadata = (
  input: Uint8Array | HexString,
): CodecType<typeof metadata> => {
  try {
    return metadata.dec(input)
  } catch (_) {}

  // comes from metadata.metadata_at_version
  try {
    return metadata.dec(optionOpaque.dec(input)!)
  } catch (_) {}

  // comes from state.getMetadata
  try {
    return metadata.dec(opaqueBytes.dec(input))
  } catch (_) {}

  // comes from metadata.metadata
  try {
    return metadata.dec(opaqueOpaqueBytes.dec(input)[1])
  } catch (_) {}

  throw null
}
