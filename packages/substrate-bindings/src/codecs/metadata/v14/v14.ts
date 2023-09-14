import { CodecType, Struct, Vector, str, u8 } from "scale-ts"
import { lookup } from "./lookup"
import { pallets } from "./pallets"
import { compactNumber } from "../../compact"
export type { V14Lookup } from "./lookup"
export type { V14Pallets } from "./pallets"

const extrinsic = Struct({
  type: compactNumber,
  version: u8,
  signedExtensions: Vector(
    Struct({
      identifier: str,
      type: compactNumber,
      additionalSigned: compactNumber,
    }),
  ),
})
export type V14Extrinsic = CodecType<typeof extrinsic>

export const v14 = Struct({
  lookup,
  pallets,
  extrinsic,
  type: compactNumber,
})
export type V14 = CodecType<typeof v14>
