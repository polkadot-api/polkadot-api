import { Codec } from "../types.ts"
import { createCodec } from "../index.ts"

const noop = (() => {}) as () => undefined
const emptyArr = new Uint8Array(0)
export const _void: Codec<undefined> = createCodec(() => emptyArr, noop)
