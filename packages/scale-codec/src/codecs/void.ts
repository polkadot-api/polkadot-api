import { Codec } from "../types"
import { createCodec } from "../"

export const VOID = Symbol("empty")
export type VOID = typeof VOID

const emptyArr = new Uint8Array(0)
export const _void: Codec<VOID> = createCodec(
  () => emptyArr,
  () => VOID,
)
