import { Bytes, Enum, Struct, Vector, _void, enhanceCodec } from "scale-ts"
import { Hex } from "./Hex"
import { compactNumber } from "./compact"

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

const fourChars = enhanceCodec(
  Bytes(4),
  textEncoder.encode.bind(textEncoder),
  textDecoder.decode.bind(textDecoder),
)

const diggestVal = Struct({
  engine: fourChars,
  payload: Hex(),
})

const diggest = Enum(
  {
    consensus: diggestVal,
    seal: diggestVal,
    preRuntime: diggestVal,
    runtimeUpdated: _void,
  },
  [4, 5, 6, 8],
)

const hex32 = Hex(32)
export const blockHeader = Struct({
  parentHash: hex32,
  number: compactNumber,
  stateRoot: hex32,
  extrinsicRoot: hex32,
  digests: Vector(diggest),
})
