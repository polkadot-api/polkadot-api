import { Enum, Struct, u32, Codec, createCodec } from "scale-ts"
import { v14 } from "./v14"

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
  }),
})
