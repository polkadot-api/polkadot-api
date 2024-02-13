import { CodecType, Struct, Tuple, Vector, str, u8 } from "scale-ts"
import { lookup } from "./lookup"
import { pallets } from "./pallets"
import { Hex, compactNumber as ty } from "../../scale"
export type { V14Lookup } from "./lookup"

const docs = Vector(str)

const runtimeApi = Struct({
  name: str,
  methods: Vector(
    Struct({
      name: str,
      inputs: Vector(
        Struct({
          name: str,
          type: ty,
        }),
      ),
      output: ty,
      docs,
    }),
  ),
  docs,
})

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
  pallets,
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
