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
import { compactTypeRefs, toBytes } from "./utils"
import { decodeAndCollectKnownLeafs } from "./decode-and-collect"
import { getProofData } from "./proof"
import { getDynamicBuilder, getLookupFn } from "@polkadot-api/metadata-builders"
import { mergeUint8 } from "@polkadot-api/utils"

export interface MetadataMerkleizer {
  /**
   * @returns Digest value of the metadata (aka its merkleized root-hash)
   */
  digest: () => Uint8Array

  /**
   * Get proof for an `Extrinsic`.
   *
   * @param transaction         Encoded `Extrinsic`, both signed or unsigned.
   * @param txAdditionalSigned  Optionally collect types for given
   *                            `additionalSigned` part of signedExtensions.
   * @returns Encoded `Proof`
   */
  getProofForExtrinsic: (
    transaction: Uint8Array | HexString,
    txAdditionalSigned?: Uint8Array | HexString,
  ) => Uint8Array

  /**
   * Get proof for `ExtrinsicPayload` parts.
   *
   * @param callData              Call data of the transaction. It has to be
   *                              bare; i.e.
   *                              without prepended compact length.
   * @param includedInExtrinsic   Extra part of the signed extensions, all of
   *                              them concatenated.
   * @param includedInSignedData  Additional signed part of the signed
   *                              extensions, all of them concatenated.
   * @returns Encoded `Proof`
   */
  getProofForExtrinsicParts: (
    callData: Uint8Array | HexString,
    includedInExtrinsic: Uint8Array | HexString,
    includedInSignedData: Uint8Array | HexString,
  ) => Uint8Array

  /**
   * Get proof for `ExtrinsicPayload`.
   *
   * @param extrinsicPayload  Call data, extra part of signedExtensions and
   *                          additional signed part of signedExtensions
   *                          concatenated. It has to be bare; i.e. without
   *                          prepended compact length.
   * @returns Encoded `Proof`
   */
  getProofForExtrinsicPayload: (
    extrinsicPayload: Uint8Array | HexString,
  ) => Uint8Array
}

const assertExpected = <T>(name: string, expected: T, received?: T): void => {
  if (received != null && received !== expected)
    throw new Error(
      `${name} not expected. Received ${received} expected ${expected}`,
    )
}

export const merkleizeMetadata = (
  metadataBytes: Uint8Array | HexString,
  {
    decimals,
    tokenSymbol,
    ...hinted
  }: { decimals: number; tokenSymbol: string } & Partial<ExtraInfo>,
): MetadataMerkleizer => {
  const metadata = getMetadata(metadataBytes)

  const checkedVersion = metadata.extrinsic.version.includes(4) ? 4 : null
  if (checkedVersion == null) throw new Error("Only extrinsic v4 is supported")

  const { ss58Prefix, buildDefinition } = getDynamicBuilder(
    getLookupFn(metadata),
  )
  if (ss58Prefix == null) throw new Error("SS58 prefix not found in metadata")
  assertExpected("SS58 prefix", ss58Prefix, hinted.base58Prefix)
  const version = metadata.pallets
    .find((x) => x.name === "System")
    ?.constants.find((x) => x.name === "Version")
  if (version == null) throw new Error("System.Version constant not found")
  const { spec_name: specName, spec_version: specVersion } = buildDefinition(
    version.type,
  ).dec(version.value)
  if (typeof specName !== "string" || typeof specVersion !== "number")
    throw new Error("Spec name or spec version not found")
  assertExpected("Spec name", specName, hinted.specName)
  assertExpected("Spec version", specVersion, hinted.specVersion)

  const info: ExtraInfo = {
    decimals,
    tokenSymbol,
    specVersion,
    specName,
    base58Prefix: ss58Prefix,
  }
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
    version: checkedVersion,
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

  const getProofForExtrinsicPayload = (
    extrinsicPayload: Uint8Array | HexString,
  ) => {
    const typeRefs: Array<TypeRef> = [
      extrinsic.callTy,
      ...extrinsic.signedExtensions.map((x) => x.includedInExtrinsic),
      ...extrinsic.signedExtensions.map((x) => x.includedInSignedData),
    ]
    return generateProof(
      decodeAndCollectKnownLeafs(extrinsicPayload, typeRefs, lookup),
    )
  }

  const getProofForExtrinsicParts = (
    callData: Uint8Array | HexString,
    includedInExtrinsic: Uint8Array | HexString,
    includedInSignedData: Uint8Array | HexString,
  ) => {
    const bytes = mergeUint8(
      [callData, includedInExtrinsic, includedInSignedData].map(toBytes),
    )
    return getProofForExtrinsicPayload(bytes)
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
    getProofForExtrinsicPayload,
  }
}
