import {
  CodecType,
  Enum,
  Option,
  Struct,
  Vector,
  _void,
  compact,
  str,
  u32,
  u8,
} from "scale-ts"

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

const bitSequence = Struct({
  bitStoreType: compact,
  bitOrderType: compact,
})

const variant = Vector(
  Struct({
    name: str,
    fields,
    index: u8,
    docs: strs,
  }),
)

const def = Enum({
  composite: fields,
  variant,
  sequence: compact,
  array: arr,
  tuple: Vector(compact),
  primitive,
  compact,
  bitSequence,
  historicMetaCompat: str,
})

const param = Struct({
  name: str,
  type: Option(compact),
})
const params = Vector(param)

const entry = Struct({
  id: compact,
  path: strs,
  params,
  def,
  docs: strs,
})

export const lookup = Vector(entry)
export type V14Lookup = CodecType<typeof lookup>
