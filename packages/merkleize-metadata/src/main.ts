import {
  Blake3256,
  HexString,
  compact,
  u32,
} from "@polkadot-api/substrate-bindings"
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
  extrinsicDec,
} from "./codecs"
import { getAccessibleTypes } from "./get-accessible-types"
import { getLookup } from "./get-lookup"
import { getMetadata } from "./get-metadata"
import { compactTypeRefs, mergeUint8, toBytes } from "./utils"
import { decodeAndCollectKnownLeafs } from "./decode-and-collect"
import { getProofData } from "./proof"

export interface MetadataMerkleizer {
  // it returns the digest value of the metadata (aka its merkleized root-hash)
  digest: () => Uint8Array

  // given an extrinsic, it returns an encoded `Proof`
  getProofForExtrinsic: (
    transaction: Uint8Array | HexString,
    txAdditionalSigned?: Uint8Array | HexString,
  ) => Uint8Array

  // given the extrinsic parts, it returns an encoded `Proof`
  getProofForExtrinsicParts: (
    callData: Uint8Array | HexString,
    includedInExtrinsic: Uint8Array | HexString,
    includedInSignedData: Uint8Array | HexString,
  ) => Uint8Array
}

export const merkleizeMetadata = (
  metadataBytes: Uint8Array | HexString,
  info: ExtraInfo,
): MetadataMerkleizer => {
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

  const lookup = getLookup(
    definitions,
    accessibleTypes,
    getTypeRef,
    getPrimitive,
  )
  const lookupEncoded = lookup.map(lookupType.enc)

  let hashTree: Array<Uint8Array> | undefined
  const getHashTree = (): Array<Uint8Array> => {
    if (hashTree) return hashTree

    if (!lookupEncoded.length) return (hashTree = [new Uint8Array(32).fill(0)])

    hashTree = new Array(lookupEncoded.length * 2 - 1)

    let leavesStartIdx = lookupEncoded.length - 1
    for (let i = 0; i < lookupEncoded.length; i++)
      hashTree[leavesStartIdx + i] = Blake3256(lookupEncoded[i])

    for (let i = hashTree.length - 2; i > 0; i -= 2)
      hashTree[(i - 1) / 2] = Blake3256(
        mergeUint8([hashTree[i], hashTree[i + 1]]),
      )

    return hashTree
  }

  let digested: undefined | Uint8Array
  const digest = () => {
    if (digested) return digested
    const rootLookupHash = getHashTree()[0]

    const digest: MetadataDigest = {
      tag: "V1",
      value: {
        typeInformationTreeRoot: rootLookupHash,
        extrinsicMetadataHash: Blake3256(extrinsicMetadata.enc(extrinsic)),
        ...info,
      },
    }

    return (digested = Blake3256(metadataDigest.enc(digest)))
  }

  const generateProof = (knownIndexes: number[]) => {
    const proofData = getProofData(lookupEncoded, knownIndexes)

    const hashTree = getHashTree()
    const proofs = proofData.proofIdxs.map((idx) => hashTree[idx])

    return mergeUint8([
      compact.enc(proofData.leaves.length),
      ...proofData.leaves,
      compact.enc(proofData.leafIdxs.length),
      ...proofData.leafIdxs.map((x) => u32.enc(x)),
      compact.enc(proofs.length),
      ...proofs,
      extrinsicMetadata.enc(extrinsic),
      extraInfo.enc(info),
    ])
  }

  const getProofForExtrinsicParts = (
    callData: Uint8Array | HexString,
    includedInExtrinsic: Uint8Array | HexString,
    includedInSignedData: Uint8Array | HexString,
  ) => {
    const bytes = mergeUint8(
      [callData, includedInExtrinsic, includedInSignedData].map(toBytes),
    )
    const typeRefs: Array<TypeRef> = [
      extrinsic.callTy,
      ...extrinsic.signedExtensions.map((x) => x.includedInExtrinsic),
      ...extrinsic.signedExtensions.map((x) => x.includedInSignedData),
    ]
    return generateProof(decodeAndCollectKnownLeafs(bytes, typeRefs, lookup))
  }

  const getProofForExtrinsic = (
    transaction: Uint8Array | HexString,
    txAdditionalSigned?: Uint8Array | HexString,
  ) => {
    let [, { version, signed }, bytes] = extrinsicDec(transaction)

    if (version !== extrinsic.version)
      throw new Error("Incorrect extrinsic version")

    const typeRefs: TypeRef[] = signed
      ? [
          extrinsic.addressTy,
          extrinsic.signatureTy,
          ...extrinsic.signedExtensions.map((x) => x.includedInExtrinsic),
          extrinsic.callTy,
        ]
      : [extrinsic.callTy]

    if (txAdditionalSigned) {
      bytes = mergeUint8([bytes, toBytes(txAdditionalSigned)])
      typeRefs.push(
        ...extrinsic.signedExtensions.map((x) => x.includedInSignedData),
      )
    }

    return generateProof(decodeAndCollectKnownLeafs(bytes, typeRefs, lookup))
  }

  return {
    digest,
    getProofForExtrinsic,
    getProofForExtrinsicParts,
  }
}
