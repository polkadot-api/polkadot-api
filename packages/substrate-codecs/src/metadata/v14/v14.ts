import { CodecType, Struct, Vector, compact, str, u8 } from "scale-ts"
import { lookup } from "./lookup"
import { pallets } from "./pallets"
export type { V14Lookup } from "./lookup"
export type { V14Pallets } from "./pallets"

const extrinsic = Struct({
  type: compact,
  version: u8,
  signedExtensions: Vector(
    Struct({
      identifier: str,
      type: compact,
      additionalSigned: compact,
    }),
  ),
})
export type V14Extrinsic = CodecType<typeof extrinsic>

export const v14 = Struct({
  lookup,
  pallets,
  extrinsic,
  type: compact,
})
export type V14 = CodecType<typeof v14>
