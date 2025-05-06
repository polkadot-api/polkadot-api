import { CodecType, Struct, Tuple, Vector, str, u8 } from "scale-ts"
import { lookup } from "./lookup"
import { v16Pallet } from "./pallets"
import { compactNumber, Hex, compactNumber as ty } from "../scale"
import { runtimeApi } from "./runtime-api"

const extrinsic = Struct({
  version: Vector(u8),
  address: ty,
  call: ty,
  signature: ty,
  signedExtensionsByVersion: Vector(Tuple(u8, Vector(compactNumber))),
  signedExtensions: Vector(
    Struct({
      identifier: str,
      type: ty,
      additionalSigned: ty,
    }),
  ),
})

export const v16 = Struct({
  lookup,
  pallets: Vector(Struct(v16Pallet)),
  extrinsic,
  apis: Vector(runtimeApi),
  outerEnums: Struct({
    call: ty,
    event: ty,
    error: ty,
  }),
  custom: Vector(Tuple(str, Struct({ type: ty, value: Hex() }))),
})
export type V16 = CodecType<typeof v16>
