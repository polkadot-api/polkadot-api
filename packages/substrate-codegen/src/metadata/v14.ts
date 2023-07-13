import {
  Struct,
  Vector,
  compact,
  str,
  u8,
} from "@unstoppablejs/substrate-codecs"
import { lookup } from "./lookup"
import { pallets } from "./pallets"

export const v14 = Struct({
  lookup,
  pallets,
  extrinsic: Struct({
    type: compact,
    version: u8,
    signedExtensions: Vector(
      Struct({
        identifier: str,
        type: compact,
        additionalSigned: compact,
      }),
    ),
  }),
  type: compact,
})
