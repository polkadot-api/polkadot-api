import {
  compact,
  extrinsicFormat,
  UnifiedMetadata,
} from "@polkadot-api/substrate-bindings"
import { mergeUint8 } from "@polkadot-api/utils"
import { getSignerType, SignerType, signingTypeId } from "./signer-type"

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
    extrinsicFormat.enc({ version: 4, type: "signed" }),
    // converting it to a `MultiAddress` enum, where the index 0 is `Id(AccountId)`
    new Uint8Array([...addressPrefix, ...publicKey]),
    signerType === SignerType.Ethereum || !signingType
      ? signed
      : new Uint8Array([signingTypeId[signingType], ...signed]),
    ...extra,
    callData,
  ])
  return mergeUint8([compact.enc(preResult.length), preResult])
}
