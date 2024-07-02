import {
  Bytes,
  CodecType,
  Option,
  ScaleEnum,
  Struct,
  Tuple,
  V15,
  Vector,
  _void,
  bool,
  compact,
  compactNumber,
  enhanceDecoder,
  str,
  u16,
  u32,
  u8,
} from "@polkadot-api/substrate-bindings"

const extraInfoInner = {
  specVersion: u32,
  specName: str,
  base58Prefix: u16,
  decimals: u8,
  tokenSymbol: str,
}
export const extraInfo = Struct(extraInfoInner)
export type ExtraInfo = CodecType<typeof extraInfo>

export const hash = Bytes(32)
export const metadataDigest = ScaleEnum({
  V0: _void,
  V1: Struct({
    typeInformationTreeRoot: hash,
    extrinsicMetadataHash: hash,
    ...extraInfoInner,
  }),
})
export type MetadataDigest = CodecType<typeof metadataDigest>

export const scalePrimitive = ScaleEnum({
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
export type ScalePrimitive = CodecType<typeof scalePrimitive>

export const typeRef = ScaleEnum({
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
  compactU8: _void,
  compactU16: _void,
  compactU32: _void,
  compactU64: _void,
  compactU128: _void,
  compactU256: _void,
  void: _void,
  perId: compactNumber,
})
export type TypeRef = CodecType<typeof typeRef>

const field = Struct({
  name: Option(str),
  ty: typeRef,
  typeName: Option(str),
})
export const typeDef = ScaleEnum({
  composite: Vector(field),
  enumeration: Struct({
    name: str,
    fields: Vector(field),
    index: compactNumber,
  }),
  sequence: typeRef,
  array: Struct({
    len: u32,
    typeParam: typeRef,
  }),
  tuple: Vector(typeRef),
  bitSequence: Struct({
    numBytes: u8,
    leastSignificantBitFirst: bool,
  }),
})
export type TypeDef = CodecType<typeof typeDef>

export const lookupType = Struct({
  path: Vector(str),
  typeDef: typeDef,
  typeId: compactNumber,
})
export const lookup = Vector(lookupType)
export type Lookup = CodecType<typeof lookup>

export const extrinsicMetadata = Struct({
  version: u8,
  addressTy: typeRef,
  callTy: typeRef,
  signatureTy: typeRef,
  signedExtensions: Vector(
    Struct({
      identifier: str,
      includedInExtrinsic: typeRef,
      includedInSignedData: typeRef,
    }),
  ),
})
export type ExtrinsicMetadata = CodecType<typeof extrinsicMetadata>
export type LookupValue = V15["lookup"] extends Array<infer T> ? T : never

const versionDecoder = enhanceDecoder(u8[1], (value) => ({
  version: value & ~(1 << 7),
  signed: !!(value & (1 << 7)),
}))

export const extrinsicDec = Tuple.dec(
  compact[1],
  versionDecoder,
  Bytes(Infinity)[1],
)

export const proof = Struct({
  leaves: lookup,
  leafIdxs: Vector(u32),
  proofs: Vector(hash),
  extrinsic: extrinsicMetadata,
  info: extraInfo,
})
