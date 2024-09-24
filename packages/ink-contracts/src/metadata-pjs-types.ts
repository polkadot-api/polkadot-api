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
      if (typeof value === "string") {
        return {
          tag: value,
          value: undefined,
        } as any
      }
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

// Seems like pjs can omit empty vectors
const PjsVector = <T>(inner: Codec<T>, size?: number) =>
  enhanceCodec(
    Vector(inner, size),
    (value: T[] | undefined) => value ?? [],
    (v) => v,
  )

const oStr = Option(str)
const docs = PjsVector(str)

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

const fields = PjsVector(
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

const variants = PjsVector(
  Struct({
    name: str,
    fields,
    index: u8,
    docs,
  }),
)

const def = Variant({
  composite: Struct({
    fields,
  }),
  variant: Struct({
    variants,
  }),
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
const params = PjsVector(param)

const metadataEntry = Struct({
  id: compactNumber,
  path: docs,
  params,
  def,
  docs,
})

const entry = enhanceCodec(
  metadataEntry,
  (value: {
    id: number
    type: {
      def: CodecType<typeof def>
      path: CodecType<typeof docs>
    }
  }) => ({
    id: value.id,
    path: value.type.path,
    params: [],
    def: value.type.def,
    docs: [],
  }),
  (value) => ({
    id: value.id,
    type: {
      def: value.def,
      path: value.path,
    },
  }),
)

export const pjsTypes = PjsVector(entry)
export type PjsTypes = CodecType<typeof pjsTypes>
