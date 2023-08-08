import {
  Struct,
  Option,
  Vector,
  u8,
  str,
  Enum,
  compact,
  _void,
  Codec,
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
  key: compact as Codec<number>,
  value: compact as Codec<number>,
})

const storageItem = Struct({
  name: str,
  modifier: u8,
  type: Enum({
    plain: compact as Codec<number>,
    map: storageMap,
  }),
  fallback: Vector(u8),
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
    calls: Option(compact),
    events: Option(compact),
    constants: Vector(
      Struct({
        name: str,
        type: compact,
        value: Vector(u8),
        docs: Vector(str),
      }),
    ),
    errors: Option(compact),
    index: u8,
  }),
)

export type V14Pallets = CodecType<typeof pallets>
