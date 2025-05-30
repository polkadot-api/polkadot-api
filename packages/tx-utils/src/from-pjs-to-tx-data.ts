import {
  _void,
  compact,
  createDecoder,
  Option,
  u16,
  u32,
  u64,
  u8,
  UnifiedMetadata,
} from "@polkadot-api/substrate-bindings"
import { Mortality, SignerPayloadJSON, TxData } from "./types"
import { fromHex, mergeUint8 } from "@polkadot-api/utils"

const MAX_U32 = 4_294_967_295
const fromPjsHexStringToNumber = (input: string): number | bigint => {
  const result = BigInt(input)
  return result > MAX_U32 ? result : Number(result)
}

const mortalDec = createDecoder((value) => {
  const enc = u16.dec(value)
  const period = 2 << enc % (1 << 4)
  const factor = Math.max(period >> 12, 1)
  const phase = (enc >> 4) * factor
  return { type: "mortal" as const, period, phase }
})

const mortalityDec = createDecoder((value) => {
  const firstByte = u8.dec(value)
  if (firstByte === 0) return { type: "inmortal" as const }
  const secondByte = u8.dec(value)
  return mortalDec(Uint8Array.from([firstByte, secondByte]))
})

const optionU32Enc = Option(u32).enc

// TODO: missing named consensus
const encodePjsOptionNetworkId = (
  _metadata: UnifiedMetadata,
  networkId: any,
): Uint8Array => {
  const keys = Object.keys(networkId)
  if (keys.length !== 1) throw "Bad length"
  const field = networkId[keys[0]]
  if (keys[0] === "any") return Uint8Array.from([0])
  if (keys[0] === "byGenesis")
    return mergeUint8([Uint8Array.from([1, 0]), fromHex(field)])
  if (keys[0] === "byFork")
    return mergeUint8([
      Uint8Array.from([1, 1]),
      u64.enc(field.blockNumber),
      fromHex(field.blockHash),
    ])
  throw new Error("Named consensus not implemented yet")
}

const encodePjsJunction = (
  metadata: UnifiedMetadata,
  junction: any,
): Uint8Array => {
  const keys = Object.keys(junction)
  if (keys.length !== 1) throw "Bad length"
  const field = junction[keys[0]]
  switch (keys[0]) {
    case "parachain":
      return mergeUint8([Uint8Array.from([0]), compact.enc(field)])
    case "accountId32":
      return mergeUint8([
        Uint8Array.from([1]),
        encodePjsOptionNetworkId(metadata, field.network),
        fromHex(field.id),
      ])
    case "accountIndex64":
      return mergeUint8([
        Uint8Array.from([2]),
        encodePjsOptionNetworkId(metadata, field.network),
        compact.enc(field.index),
      ])
    case "accountKey20":
      return mergeUint8([
        Uint8Array.from([3]),
        encodePjsOptionNetworkId(metadata, field.network),
        fromHex(field.key),
      ])
    case "palletInstance":
      return mergeUint8([Uint8Array.from([4]), u8.enc(field)])
    case "generalIndex":
      return mergeUint8([Uint8Array.from([5]), compact.enc(field)])
    case "generalKey":
      // General key is not used to locate assets
      throw "Unexpected generalKey type"
    case "onlyChild":
      return Uint8Array.from([7])
    case "plurality": // Plurality is not used to locate assets
      throw "Unexpected plurality type"
    case "globalConsensus":
      return mergeUint8([
        Uint8Array.from([9]),
        // it is not an option here
        encodePjsOptionNetworkId(metadata, field).slice(1),
      ])
    default:
      throw `Unexpected junction type ${keys[0]}`
  }
}
const fromPjsAssetIdToSigExt = (
  metadata: UnifiedMetadata,
  pjsAssetId: any,
): Uint8Array => {
  // get rid of easy wins
  if (typeof pjsAssetId === "string") return fromHex(pjsAssetId)
  if (typeof pjsAssetId === "number") return optionU32Enc(pjsAssetId)

  const encodedData: Uint8Array[] = []
  if (!("parents" in pjsAssetId && "interior" in pjsAssetId))
    throw "Location type not found"
  encodedData.push(u8.enc(pjsAssetId.parents))
  const keys = Object.keys(pjsAssetId.interior)
  if (keys.length !== 1) throw "Enum with more than one entry"
  const key = keys[0]
  if (key === "here") {
    encodedData.push(Uint8Array.from([0]))
    return mergeUint8(encodedData)
  } else if (
    !(
      key.startsWith("x") &&
      key.length === 2 &&
      Number.isInteger(parseInt(key[1]))
    )
  )
    throw "Not safe"
  const arrLen = parseInt(key[1])
  encodedData.push(Uint8Array.from([arrLen]))
  if (arrLen !== 1) {
    for (const junction of pjsAssetId.interior[key]) {
      encodedData.push(encodePjsJunction(metadata, junction))
    }
  } else {
    encodedData.push(encodePjsJunction(metadata, pjsAssetId.interior[key]))
  }

  // it is an option
  return mergeUint8([Uint8Array.from([1]), ...encodedData])
}

export const fromPjsToTxData = (
  metadata: UnifiedMetadata,
  { genesisHash, ...input }: SignerPayloadJSON,
): TxData => {
  const eraDecoded = mortalityDec(input.era)
  const mortality: Mortality =
    eraDecoded.type === "inmortal"
      ? { mortal: false, genesisHash: input.era }
      : {
          mortal: true,
          blockHash: input.blockHash,
          phase: eraDecoded.phase,
          period: eraDecoded.period,
        }

  return {
    callData: fromHex(input.method),
    genesisHash,
    mortality,
    tip: BigInt(fromPjsHexStringToNumber(input.tip)),
    nonce: fromPjsHexStringToNumber(input.nonce) as number,
    metadataHash:
      input.mode === 1 && input.metadataHash
        ? fromHex(input.metadataHash)
        : null,
    asset:
      input.assetId != null
        ? fromPjsAssetIdToSigExt(metadata, input.assetId)
        : undefined,
  }
}
