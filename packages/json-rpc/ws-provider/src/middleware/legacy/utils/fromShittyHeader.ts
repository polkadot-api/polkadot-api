import { ShittyHeader } from "../types"
import { compact } from "@polkadot-api/substrate-bindings"
import { fromHex, mergeUint8, toHex } from "@polkadot-api/utils"

export const getFromShittyHeader =
  (hasher: (input: Uint8Array) => Uint8Array) =>
  ({
    parentHash,
    number: rawNumber,
    stateRoot,
    extrinsicsRoot,
    digest,
  }: ShittyHeader) => {
    const number = Number(rawNumber)
    const rawDigests = digest.logs.map(fromHex)

    const rawHeader = mergeUint8([
      fromHex(parentHash),
      compact.enc(number),
      fromHex(stateRoot),
      fromHex(extrinsicsRoot),
      compact.enc(digest.logs.length),
      ...rawDigests,
    ])

    return {
      parent: parentHash,
      hash: toHex(hasher(rawHeader)),
      number,
      hasUpgrade: rawDigests.some(([x]) => x === 8),
      header: toHex(rawHeader),
    }
  }
