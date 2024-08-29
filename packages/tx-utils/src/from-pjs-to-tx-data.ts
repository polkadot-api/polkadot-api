import { createDecoder, u16, u8 } from "@polkadot-api/substrate-bindings"
import { Mortality, SignerPayloadJSON, TxData } from "./types"
import { fromHex } from "@polkadot-api/utils"

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

export const fromPjsToTxData = ({
  genesisHash,
  ...input
}: SignerPayloadJSON): TxData => {
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
    asset: undefined, // TODO: figure out a way to convert the messy `assetId` on the PJS payload to the canonical one
  }
}
