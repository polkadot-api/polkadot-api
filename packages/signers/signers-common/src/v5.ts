import { compact, extrinsicFormat } from "@polkadot-api/substrate-bindings"
import { mergeUint8 } from "@polkadot-api/utils"

export const createV5Tx = (
  extensionVersion: number,
  extra: Uint8Array[],
  callData: Uint8Array,
) => {
  const preResult = mergeUint8([
    extrinsicFormat.enc({ version: 5, type: "general" }),
    new Uint8Array([extensionVersion]),
    ...extra,
    callData,
  ])
  return mergeUint8([compact.enc(preResult.length), preResult])
}
