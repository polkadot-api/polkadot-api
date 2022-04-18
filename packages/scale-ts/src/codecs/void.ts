import { Codec } from "../types"
import { createCodec } from "../"

const emptyArr = new Uint8Array(0)
export const _void: Codec<undefined> = createCodec(
  () => emptyArr,
  Function.prototype as () => undefined,
)
