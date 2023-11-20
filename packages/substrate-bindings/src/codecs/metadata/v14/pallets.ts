import { Hex, compactNumber } from "@/codecs"
import {
  Struct,
  Option,
  Vector,
  u8,
  str,
  Enum,
  _void,
  CodecType,
} from "scale-ts"

const hashType = Enum({
  Blake2128: _void,
  Blake2256: _void,
  Blake2128Concat: _void,
  Twox128: _void,
  Twox256: _void,
  Twox64Concat: _void,
  Identity: _void,
})

const hashers = Vector(hashType)

const storageMap = Struct({
  hashers,
  key: compactNumber,
  value: compactNumber,
})

const storageItem = Struct({
  name: str,
  modifier: u8,
  type: Enum({
    plain: compactNumber,
    map: storageMap,
  }),
  fallback: Hex(),
  docs: Vector(str),
})

const storage = Option(
  Struct({
    prefix: str,
    items: Vector(storageItem),
  }),
)

export const pallets = Vector(
  Struct({
    name: str,
    storage,
    calls: Option(compactNumber),
    events: Option(compactNumber),
    constants: Vector(
      Struct({
        name: str,
        type: compactNumber,
        value: Hex(),
        docs: Vector(str),
      }),
    ),
    errors: Option(compactNumber),
    index: u8,
  }),
)

export type V14Pallets = CodecType<typeof pallets>
