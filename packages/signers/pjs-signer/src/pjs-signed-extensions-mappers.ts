import {
  Bytes,
  Struct,
  compact,
  u32,
  Option,
  compactBn,
} from "@polkadot-api/substrate-bindings"
import { toHex } from "@polkadot-api/utils"

type SignedExtension = {
  value: Uint8Array
  additionalSigned: Uint8Array
}

export const CheckGenesis = ({
  additionalSigned,
}: SignedExtension): { genesisHash: string } => ({
  genesisHash: toHex(additionalSigned),
})

export const CheckNonce = ({
  value,
}: SignedExtension): { nonce: number | bigint } => {
  return { nonce: compact.dec(value) }
}

export const CheckTxVersion = ({
  additionalSigned,
}: SignedExtension): { transactionVersion: number } => {
  return { transactionVersion: u32.dec(additionalSigned) }
}

const assetTxPaymentDec = Struct({
  tip: compact,
  asset: Option(Bytes(Infinity)),
}).dec

export const ChargeAssetTxPayment = ({
  value,
}: SignedExtension): { aseetId?: string; tip?: string } => {
  const { tip, asset } = assetTxPaymentDec(value)

  return {
    ...(asset ? { assetId: toHex(asset) } : {}),
    ...(tip > 0n ? { tip: "0x" + tip.toString(16) } : {}),
  }
}

export const ChargeTransactionPayment = ({
  value,
}: SignedExtension): { tip: string } => ({
  tip: "0x" + compactBn.dec(value).toString(16),
})

export const CheckMortality = (
  { value, additionalSigned }: SignedExtension,
  blockNumber: number,
) => {
  const result: { era: string; blockHash: string; blockNumber?: number } = {
    era: toHex(value),
    blockHash: toHex(additionalSigned),
  }
  if (value.length > 1) result.blockNumber = blockNumber
  return result
}

export const CheckSpecVersion = ({ additionalSigned }: SignedExtension) => ({
  specVersion: u32.dec(additionalSigned),
})
