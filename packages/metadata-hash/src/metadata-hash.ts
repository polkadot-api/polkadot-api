import { Blake3256, HexString, h64 } from "@polkadot-api/substrate-bindings"
import {
  ExtraInfo,
  ExtrinsicMetadata,
  LookupValue,
  MetadataDigest,
  ScalePrimitive,
  TypeRef,
  extraInfo,
  extrinsicMetadata,
  lookupType,
  metadataDigest,
} from "./codecs"
import { getAccessibleTypes } from "./get-accessible-types"
import { getTypeTree } from "./get-type-tree"
import { getMetadata } from "./get-metadata"
import { mergeUint8 } from "./merge-bytes"

const compactTypeRefs = {
  null: "void" as const,
  u8: "compactU8" as const,
  u16: "compactU16" as const,
  u32: "compactU32" as const,
  u64: "compactU64" as const,
  u128: "compactU128" as const,
  u256: "compactU256" as const,
}

const cache = new Map<bigint, Uint8Array>()
export const buildMetadataHash = (
  metadataBytes: Uint8Array | HexString,
  info: ExtraInfo,
): Uint8Array => {
  const metadata = getMetadata(metadataBytes)

  const definitions = new Map<number, LookupValue>(
    metadata.lookup.map((value) => [value.id, value]),
  )
  const accessibleTypes = getAccessibleTypes(metadata, definitions)

  const getPrimitive = (frameId: number): ScalePrimitive["tag"] | null => {
    const {
      def: { tag, value },
    } = definitions.get(frameId)!

    if (tag === "primitive") return value.tag

    if ((tag !== "composite" && tag !== "tuple") || value.length > 1)
      throw new Error("The provided definition doesn't map to a primitive")

    return value.length === 0
      ? null // signals `void`
      : getPrimitive(tag === "tuple" ? value[0] : value[0].type)
  }

  const getTypeRef = (frameId: number): TypeRef => {
    const { def } = definitions.get(frameId)!

    if (def.tag === "primitive") return { tag: def.value.tag, value: undefined }

    if (def.tag === "compact") {
      const primitive = getPrimitive(def.value)
      const tag = compactTypeRefs[primitive as "u8"]
      if (!tag) throw new Error("Invalid primitive for Compact")
      return { tag, value: undefined }
    }

    return accessibleTypes.has(frameId)
      ? { tag: "perId", value: accessibleTypes.get(frameId)! }
      : { tag: "void", value: undefined }
  }

  const trimmedTree = getTypeTree(
    definitions,
    accessibleTypes,
    getTypeRef,
    getPrimitive,
  ).map(lookupType.enc)

  const cachedKey = h64(mergeUint8([...trimmedTree, extraInfo.enc(info)]))
  const cached = cache.get(cachedKey)
  if (cached) return cached

  // let's build the lookup hash
  const nodes = trimmedTree.map(Blake3256)
  while (nodes.length > 1) {
    const right = nodes.pop()!
    const left = nodes.pop()!
    nodes.unshift(Blake3256(mergeUint8([left, right])))
  }
  // if no types in the tree, we need to return 0's array
  const rootLookupHash = !nodes.length ? new Uint8Array(32).fill(0) : nodes[0]

  const extrinsic: ExtrinsicMetadata = {
    version: metadata.extrinsic.version,
    addressTy: getTypeRef(metadata.extrinsic.address),
    callTy: getTypeRef(metadata.extrinsic.call),
    signatureTy: getTypeRef(metadata.extrinsic.signature),
    signedExtensions: metadata.extrinsic.signedExtensions.map((se) => ({
      identifier: se.identifier,
      includedInExtrinsic: getTypeRef(se.type),
      includedInSignedData: getTypeRef(se.additionalSigned),
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

  const result = Blake3256(metadataDigest.enc(digest))
  cache.set(cachedKey, result)
  return result
}
