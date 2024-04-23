import { CodecType, Struct, Tuple, Vector, str, u8 } from "scale-ts"
import { lookup } from "./lookup"
import { v15Pallet } from "./pallets"
import { Hex, compactNumber as ty } from "../scale"
import { runtimeApi } from "./runtime-api"
export type { V14Lookup } from "./lookup"

const extrinsic = Struct({
  version: u8,
  address: ty,
  call: ty,
  signature: ty,
  extra: ty,
  signedExtensions: Vector(
    Struct({
      identifier: str,
      type: ty,
      additionalSigned: ty,
    }),
  ),
})
export type V15Extrinsic = CodecType<typeof extrinsic>

export const v15 = Struct({
  lookup,
  pallets: Vector(Struct(v15Pallet)),
  extrinsic,
  type: ty,
  apis: Vector(runtimeApi),
  outerEnums: Struct({
    call: ty,
    event: ty,
    error: ty,
  }),
  custom: Vector(Tuple(str, Struct({ type: ty, value: Hex() }))),
})
export type V15 = CodecType<typeof v15>
