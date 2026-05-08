import { getLookupFn, LookupEntry } from "@polkadot-api/metadata-builders"
import { UnifiedMetadata } from "@polkadot-api/substrate-bindings"

export const enum SignerType {
  Polkadot,
  Ethereum,
}
const unkownSignerType = () => new Error("Unkown signer")
export const getSignerType = (
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

export const signingTypeId: Record<"Ecdsa" | "Ed25519" | "Sr25519", number> = {
  Ed25519: 0,
  Sr25519: 1,
  Ecdsa: 2,
}
