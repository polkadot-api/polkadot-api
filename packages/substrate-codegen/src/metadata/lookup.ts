import {
  Enum,
  Option,
  Struct,
  Vector,
  _void,
  compact,
  str,
  u32,
  u8,
} from "@unstoppablejs/substrate-codecs"

const oStr = Option(str)
const strs = Vector(str)

const primitive = Enum({
  bool: _void,
  char: _void,
  str: _void,
  u8: _void,
  u16: _void,
  u32: _void,
  u64: _void,
  u128: _void,
  u256: _void,
  i8: _void,
  i16: _void,
  i32: _void,
  i64: _void,
  i128: _void,
  i256: _void,
})

const fields = Vector(
  Struct({
    name: oStr,
    type: compact,
    typeName: oStr,
    docs: strs,
  }),
)

const arr = Struct({
  len: u32,
  type: compact,
})

const def = Enum({
  composite: fields,
  variant: Vector(
    Struct({
      name: str,
      fields,
      index: u8,
      docs: strs,
    }),
  ),
  sequence: compact,
  array: arr,
  tuple: Vector(compact),
  primitive,
  compact,
  bitSequence: Struct({
    bitStoreType: compact,
    bitOrderType: compact,
  }),
  historicMetaCompat: str,
})

const innerType = Struct({
  path: strs,
  params: Vector(
    Struct({
      name: str,
      type: Option(compact),
    }),
  ),
  def,
  docs: strs,
})

const entry = Struct({
  id: compact,
  type: innerType,
})

export const lookup = Vector(entry)
