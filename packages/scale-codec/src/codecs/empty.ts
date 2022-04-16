import { Codec, Encoder, Decoder } from "../types"
import { toInternalBytes } from "../internal"
import { createCodec } from "../"

export const EMPTY = Symbol("empty")

const emptyEnc: Encoder<typeof EMPTY> = () => new Uint8Array(0)
const emptyDec: Decoder<typeof EMPTY> = toInternalBytes(() => EMPTY)

export const empty: Codec<typeof EMPTY> = createCodec(emptyEnc, emptyDec)
