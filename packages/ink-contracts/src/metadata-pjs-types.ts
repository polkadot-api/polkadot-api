import { compactNumber } from "@polkadot-api/substrate-bindings"
import {
  _void,
  CodecType,
  str,
  Struct,
  u32,
  u8,
  Vector,
  Option,
  enhanceCodec,
  Enum,
  StringRecord,
  Codec,
} from "scale-ts"

type PjsVariant<O extends StringRecord<Codec<any>>> = {
  [K in keyof O]: {
    [KK in K]: CodecType<O[K]>
  }
}[keyof O]
const Variant = <O extends StringRecord<Codec<any>>>(inner: O) =>
  enhanceCodec(
    Enum(inner),
    (value: PjsVariant<O>) => {
      const [tag, val] = Object.entries(value)[0]

      return {
        tag: tag as keyof O,
        value: val,
      }
    },
    (value) => {
      return {
        [value.tag]: value.value,
      } as PjsVariant<O>
    },
  )

const oStr = Option(str)
const docs = Vector(str)

const primitive = Variant({
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
    type: compactNumber,
    typeName: oStr,
    docs,
  }),
)

const arr = Struct({
  len: u32,
  type: compactNumber,
})

const bitSequence = Struct({
  bitStoreType: compactNumber,
  bitOrderType: compactNumber,
})

const variant = Vector(
  Struct({
    name: str,
    fields,
    index: u8,
    docs,
  }),
)

const def = Variant({
  composite: fields,
  variant,
  sequence: compactNumber,
  array: arr,
  tuple: Vector(compactNumber),
  primitive,
  compact: compactNumber,
  bitSequence,
})

const param = Struct({
  name: str,
  type: Option(compactNumber),
})
const params = Vector(param)

const entry = Struct({
  id: compactNumber,
  path: docs,
  params,
  def,
  docs,
})

export const pjsTypes = Vector(entry)
export type PjsTypes = CodecType<typeof pjsTypes>
