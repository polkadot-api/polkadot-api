import { CodecType, Struct, Vector, createCodec, str, u8 } from "scale-ts"
import { lookup } from "./lookup"
import { compactNumber } from "../scale"
import { v14Pallet } from "./pallets"
import { runtimeApi } from "./runtime-api"

const empty = new Uint8Array()
const Always = <T>(value: T) =>
  createCodec<T>(
    () => empty,
    () => value,
  )

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
  pallets: Vector(Struct({ ...v14Pallet, docs: Always([] as string[]) })),
  extrinsic,
  type: compactNumber,
  apis: Always([] as Array<CodecType<typeof runtimeApi>>),
})
export type V14 = CodecType<typeof v14>
