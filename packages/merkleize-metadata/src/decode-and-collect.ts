import {
  HexString,
  _void,
  compact,
  createDecoder,
  i128,
  i16,
  i256,
  i32,
  i64,
  i8,
  str,
  u128,
  u16,
  u256,
  u32,
  u64,
  u8,
} from "@polkadot-api/substrate-bindings"
import { Lookup, TypeDef, TypeRef } from "./codecs"

const typeRefDecoders = {
  bool: u8,
  char: u8,
  str,
  u8,
  u16,
  u32,
  u64,
  u128,
  u256,
  i8,
  i16,
  i32,
  i64,
  i128,
  i256,
  void: _void,
  compactU8: compact,
  compactU16: compact,
  compactU32: compact,
  compactU64: compact,
  compactU128: compact,
  compactU256: compact,
}

const innerDecodeAndCollect = (
  input: Uint8Array,
  typeRef: TypeRef,
  idToLookups: Map<number, Array<number>>,
  lookup: Lookup,
  collected: Set<number>,
) => {
  if (typeRef.tag !== "perId") {
    typeRefDecoders[typeRef.tag][1](input)
    return
  }

  const handleTypeRef = (typeRef: TypeRef) => {
    innerDecodeAndCollect(input, typeRef, idToLookups, lookup, collected)
  }

  const lookupIdxs = idToLookups.get(typeRef.value)!
  const [currentIdx] = lookupIdxs
  const current = lookup[currentIdx]

  if (lookupIdxs.length === 1) collected.add(currentIdx)

  switch (current.typeDef.tag) {
    case "enumeration": {
      const selectedIdx = u8.dec(input)
      const [selected, collectedIdx] = lookupIdxs
        .map(
          (lookupIdx) =>
            [lookup[lookupIdx].typeDef, lookupIdx] as [
              TypeDef & { tag: "enumeration" },
              number,
            ],
        )
        .find(([x]) => x.value.index === selectedIdx)!
      collected.add(collectedIdx)
      selected.value.fields.forEach(({ ty }) => {
        handleTypeRef(ty)
      })
      break
    }
    case "sequence": {
      const len = compact.dec(input)
      for (let i = 0; i < len; i++) handleTypeRef(current.typeDef.value)
      break
    }
    case "array": {
      for (let i = 0; i < current.typeDef.value.len; i++)
        handleTypeRef(current.typeDef.value.typeParam)
      break
    }
    case "composite": {
      current.typeDef.value.forEach((x) => {
        handleTypeRef(x.ty)
      })
      break
    }
    case "tuple": {
      current.typeDef.value.forEach(handleTypeRef)
      break
    }
    case "bitSequence":
      throw new Error("bitSequence is not supported")
  }
}

export const decodeAndCollectKnownLeafs = (
  data: Uint8Array | HexString,
  typeRefs: Array<TypeRef>,
  lookup: Lookup,
): Array<number> => {
  let input = new Uint8Array()
  createDecoder((_input) => {
    input = _input
  })(data)

  const idToLookups = new Map<number, number[]>()
  lookup.forEach((lookup, idx) => {
    const arr = idToLookups.get(lookup.typeId)
    if (arr) arr.push(idx)
    else idToLookups.set(lookup.typeId, [idx])
  })

  const result = new Set<number>()
  typeRefs.forEach((typeRef) => {
    innerDecodeAndCollect(input, typeRef, idToLookups, lookup, result)
  })

  return [...result].sort((a, b) => a - b)
}
