import { Blake3256, V15, h64, v15 } from "@polkadot-api/substrate-bindings"
import { mergeUint8 } from "@polkadot-api/utils"
import {
  ExtraInfo,
  ExtrinsicMetadata,
  Lookup,
  MetadataDigest,
  ScalePrimitive,
  TypeDef,
  TypeRef,
  extraInfo,
  extrinsicMetadata,
  lookupType,
  metadataDigest,
} from "./codecs"

// h64(scale(metadata|tokenSymbol|tokenDecimals)): metadataDigest
const cache = new Map<bigint, Uint8Array>()

const pruneAndCollectAccessibleTypes = (
  metadata: V15,
  accessibleTypes: number[],
  id: number,
) => {
  if (accessibleTypes.indexOf(id) !== -1) return
  const { def } = metadata.lookup.find((x) => x.id === id)!
  switch (def.tag) {
    case "composite":
      if (def.value.length !== 0) {
        accessibleTypes.push(id)
        def.value.forEach(({ type }) =>
          pruneAndCollectAccessibleTypes(metadata, accessibleTypes, type),
        )
      }
      break
    case "variant":
      if (def.value.length !== 0) {
        accessibleTypes.push(id)
        def.value.forEach(({ fields }) =>
          fields.forEach(({ type }) =>
            pruneAndCollectAccessibleTypes(metadata, accessibleTypes, type),
          ),
        )
      }
      break
    case "sequence":
      accessibleTypes.push(id)
      pruneAndCollectAccessibleTypes(metadata, accessibleTypes, def.value)
      break
    case "array":
      accessibleTypes.push(id)
      pruneAndCollectAccessibleTypes(metadata, accessibleTypes, def.value.type)
      break
    case "tuple":
      if (def.value.length !== 0) {
        accessibleTypes.push(id)
        def.value.forEach((type) =>
          pruneAndCollectAccessibleTypes(metadata, accessibleTypes, type),
        )
      }
      break
    case "bitSequence": // bitSequence inner types are not stored
      accessibleTypes.push(id)
      break
    // primitive and compact are not stored
    case "primitive":
    case "compact":
      break
  }
}

const collectPrimitives = (
  metadata: V15,
  primitives: ScalePrimitive["tag"][],
  alreadyVisited: number[],
  frameId: number,
) => {
  if (alreadyVisited.includes(frameId)) return
  alreadyVisited.push(frameId)

  const { def } = metadata.lookup.find((x) => x.id === frameId)!
  switch (def.tag) {
    case "composite":
      def.value.forEach(({ type }) =>
        collectPrimitives(metadata, primitives, alreadyVisited, type),
      )
      break
    case "variant":
      def.value.forEach(({ fields }) =>
        fields.forEach(({ type }) =>
          collectPrimitives(metadata, primitives, alreadyVisited, type),
        ),
      )
      break
    case "array":
      break
    case "tuple":
      def.value.forEach((f) =>
        collectPrimitives(metadata, primitives, alreadyVisited, f),
      )
      break
    case "primitive":
      primitives.push(def.value.tag)
      break
    case "sequence":
    case "compact":
      collectPrimitives(metadata, primitives, alreadyVisited, def.value)
      break
    case "bitSequence":
      collectPrimitives(
        metadata,
        primitives,
        alreadyVisited,
        def.value.bitOrderType,
      )
      collectPrimitives(
        metadata,
        primitives,
        alreadyVisited,
        def.value.bitStoreType,
      )
      break
  }
}

const getTypeRef = (
  metadata: V15,
  accessibleTypes: number[],
  frameId: number,
): TypeRef => {
  const { def } = metadata.lookup.find((x) => x.id === frameId)!

  switch (def.tag) {
    case "composite":
    case "variant":
    case "tuple":
      if (accessibleTypes.includes(frameId))
        return { tag: "perId", value: accessibleTypes.indexOf(frameId) }
      else return { tag: "void", value: undefined }
    case "sequence":
    case "array":
    case "bitSequence":
      return { tag: "perId", value: accessibleTypes.indexOf(frameId) }
    case "primitive":
      // MerklePrimitive is a superset of ScalePrimitive
      return { tag: def.value.tag, value: undefined }
  }
  // from here on we have a compact
  const primitives: ScalePrimitive["tag"][] = []
  collectPrimitives(metadata, primitives, [], frameId)
  if (primitives.length > 1)
    throw new Error("Expected to find exactly 0 or 1 primitive")
  if (primitives.length === 0) return { tag: "void", value: undefined }
  switch (primitives[0]) {
    case "u8":
      return { tag: "compactU8", value: undefined }
    case "u16":
      return { tag: "compactU16", value: undefined }
    case "u32":
      return { tag: "compactU32", value: undefined }
    case "u64":
      return { tag: "compactU64", value: undefined }
    case "u128":
      return { tag: "compactU128", value: undefined }
    case "u256":
      return { tag: "compactU256", value: undefined }
    default:
      throw new Error("Invalid primitive for Compact")
  }
}

const constructTypeDef = (
  metadata: V15,
  accessibleTypes: number[],
  frameId: number,
): TypeDef[] => {
  const { def } = metadata.lookup.find((x) => x.id === frameId)!
  switch (def.tag) {
    case "composite":
      if (def.value.length === 0)
        throw new Error("Empty composites should be filtered out")
      return [
        {
          tag: "composite",
          value: def.value.map((f) => ({
            name: f.name,
            typeName: f.typeName,
            ty: getTypeRef(metadata, accessibleTypes, f.type),
          })),
        },
      ]
    case "variant": {
      if (def.value.length === 0)
        throw new Error("Empty composites should be filtered out")
      return def.value.map((v) => ({
        tag: "enumeration" as "enumeration",
        value: {
          name: v.name,
          index: v.index,
          fields: v.fields.map((f) => ({
            name: f.name,
            typeName: f.typeName,
            ty: getTypeRef(metadata, accessibleTypes, f.type),
          })),
        },
      }))
    }
    case "sequence":
      return [
        {
          tag: "sequence",
          value: getTypeRef(metadata, accessibleTypes, def.value),
        },
      ]
    case "array":
      return [
        {
          tag: "array",
          value: {
            len: def.value.len,
            typeParam: getTypeRef(metadata, accessibleTypes, def.value.type),
          },
        },
      ]
    case "tuple":
      if (def.value.length === 0)
        throw new Error("Empty tuples should be filtered out")
      return [
        {
          tag: "tuple",
          value: def.value.map((id) =>
            getTypeRef(metadata, accessibleTypes, id),
          ),
        },
      ]
    case "bitSequence": {
      const primitives: ScalePrimitive["tag"][] = []
      collectPrimitives(metadata, primitives, [], def.value.bitStoreType)
      if (primitives.length !== 1)
        throw new Error("Expected to find exactly 1 primitive")
      let numBytes
      switch (primitives[0]) {
        case "u8":
          numBytes = 1
          break
        case "u16":
          numBytes = 2
          break
        case "u32":
          numBytes = 4
          break
        case "u64":
          numBytes = 8
          break
        default:
          throw new Error("Invalid primitive for BitSequence")
      }
      const bitOrderType = def.value.bitOrderType
      const storeOrderPath = metadata.lookup.find(
        (x) => x.id === bitOrderType,
      )!.path
      let leastSignificantBitFirst
      if (storeOrderPath.includes("Lsb0")) leastSignificantBitFirst = true
      else if (storeOrderPath.includes("Msb0")) leastSignificantBitFirst = false
      else throw new Error("BitOrderType not recognized")
      return [
        {
          tag: "bitSequence",
          value: { numBytes, leastSignificantBitFirst },
        },
      ]
    }
    case "primitive":
    case "compact":
      throw new Error("Primitives and Compacts should be filtered out")
  }
}

export const buildMetadataHash = (
  metadata: V15,
  info: ExtraInfo,
): Uint8Array => {
  const keyHash = h64(mergeUint8(v15.enc(metadata), extraInfo.enc(info)))
  if (cache.has(keyHash)) {
    return cache.get(keyHash)!
  }

  const accessibleTypes: number[] = []
  pruneAndCollectAccessibleTypes(
    metadata,
    accessibleTypes,
    metadata.extrinsic.call,
  )
  pruneAndCollectAccessibleTypes(
    metadata,
    accessibleTypes,
    metadata.extrinsic.address,
  )
  pruneAndCollectAccessibleTypes(
    metadata,
    accessibleTypes,
    metadata.extrinsic.signature,
  )
  metadata.extrinsic.signedExtensions.forEach((se) => {
    pruneAndCollectAccessibleTypes(metadata, accessibleTypes, se.type)
    pruneAndCollectAccessibleTypes(
      metadata,
      accessibleTypes,
      se.additionalSigned,
    )
  })
  accessibleTypes.sort((a, b) => a - b)

  const typeTree: Lookup = []
  accessibleTypes.forEach((ty, idx) => {
    const frameType = metadata.lookup.find((x) => x.id === ty)!
    constructTypeDef(metadata, accessibleTypes, ty).forEach((tyDef) => {
      typeTree.push({
        path: frameType.path,
        typeId: idx,
        typeDef: tyDef,
      })
    })
  })

  typeTree.sort((a, b) => {
    if (a.typeId !== b.typeId) return a.typeId - b.typeId // in general
    // should only happen for variants
    if (a.typeDef.tag !== "enumeration" || b.typeDef.tag !== "enumeration")
      throw new Error("Found two types with same id")
    return a.typeDef.value.index - b.typeDef.value.index
  })

  // let's build the lookup hash
  const nodes = typeTree.map((x) => Blake3256(lookupType.enc(x)))
  while (nodes.length > 1) {
    const right = nodes.pop()!
    const left = nodes.pop()!
    nodes.unshift(Blake3256(mergeUint8(left, right)))
  }
  // if no types in the tree, we need to return 0's array
  const rootLookupHash =
    nodes.length === 1 ? nodes.pop()! : new Uint8Array(32).fill(0)
  const extrinsic: ExtrinsicMetadata = {
    version: metadata.extrinsic.version,
    addressTy: getTypeRef(
      metadata,
      accessibleTypes,
      metadata.extrinsic.address,
    ),
    callTy: getTypeRef(metadata, accessibleTypes, metadata.extrinsic.call),
    signatureTy: getTypeRef(
      metadata,
      accessibleTypes,
      metadata.extrinsic.signature,
    ),
    signedExtensions: metadata.extrinsic.signedExtensions.map((se) => ({
      identifier: se.identifier,
      includedInExtrinsic: getTypeRef(metadata, accessibleTypes, se.type),
      includedInSignedData: getTypeRef(
        metadata,
        accessibleTypes,
        se.additionalSigned,
      ),
    })),
  }

  const digest: MetadataDigest = {
    tag: "V1",
    value: {
      typeInformationTreeRoot: rootLookupHash,
      extrinsicMetadataHash: Blake3256(extrinsicMetadata.enc(extrinsic)),
      ...info,
    },
  }
  return Blake3256(metadataDigest.enc(digest))
}
