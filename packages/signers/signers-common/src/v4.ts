import {
  compact,
  enhanceEncoder,
  u8,
  UnifiedMetadata,
} from "@polkadot-api/substrate-bindings"
import { mergeUint8 } from "@polkadot-api/utils"
import { getLookupFn, LookupEntry } from "@polkadot-api/metadata-builders"

const versionCodec = enhanceEncoder(
  u8.enc,
  (value: { signed: boolean; version: number }) =>
    (+!!value.signed << 7) | value.version,
)

const enum SignerType {
  Polkadot,
  Ethereum,
}
const unkownSignerType = () => new Error("Unkown signer")
const getSignerType = (
  metadata: UnifiedMetadata,
): [SignerType, [] | [number]] => {
  const { extrinsic } = metadata
  const getLookup = getLookupFn(metadata)
  let address: LookupEntry
  let signature: LookupEntry
  if ("address" in extrinsic) {
    address = getLookup(extrinsic.address)
    signature = getLookup(extrinsic.signature)
  } else {
    const extProps = Object.fromEntries(
      metadata.lookup[extrinsic.type].params
        .filter((x) => x.type != null)
        .map((x) => [x.name, getLookup(x.type!)]),
    )
    address = extProps["Address"]
    signature = extProps["Signature"]
    if (!address || !signature) throw unkownSignerType()
  }

  if (
    address.type === "AccountId20" &&
    signature.type === "array" &&
    signature.len === 65 &&
    signature.value.type === "primitive" &&
    signature.value.value === "u8"
  )
    return [SignerType.Ethereum, []]

  if (
    signature.type !== "enum" ||
    ["Ecdsa", "Ed25519", "Sr25519"].some((x) => !(x in signature.value))
  )
    throw unkownSignerType()

  if (address.type === "enum") {
    const id = address.value["Id"]
    if (id.type === "lookupEntry" && id.value.type === "AccountId32")
      return [SignerType.Polkadot, [id.idx]]
  } else if (address.type === "AccountId32") return [SignerType.Polkadot, []]
  throw unkownSignerType()
}

const signingTypeId: Record<"Ecdsa" | "Ed25519" | "Sr25519", number> = {
  Ed25519: 0,
  Sr25519: 1,
  Ecdsa: 2,
}

export const createV4Tx = (
  metadata: UnifiedMetadata,
  publicKey: Uint8Array,
  signed: Uint8Array,
  extra: Uint8Array[],
  callData: Uint8Array,
  signingType?: "Ecdsa" | "Ed25519" | "Sr25519",
) => {
  const [signerType, addressPrefix] = getSignerType(metadata)
  const preResult = mergeUint8([
    versionCodec({ signed: true, version: 4 }),
    // converting it to a `MultiAddress` enum, where the index 0 is `Id(AccountId)`
    signerType === SignerType.Ethereum
      ? publicKey
      : new Uint8Array([...addressPrefix, ...publicKey]),
    signerType === SignerType.Ethereum || !signingType
      ? signed
      : new Uint8Array([signingTypeId[signingType], ...signed]),
    ...extra,
    callData,
  ])
  return mergeUint8([compact.enc(preResult.length), preResult])
}
