import { HexString } from "@polkadot-api/substrate-bindings"
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

const toPjsHex = (value: number | bigint) => {
  const inner = value.toString(16)
  return "0x" + (inner.length % 2 ? "0" : "") + inner
}

export const CheckGenesis = ({
  additionalSigned,
}: SignedExtension): { genesisHash: string } => ({
  genesisHash: toHex(additionalSigned),
})

export const CheckNonce = ({
  value,
}: SignedExtension): { nonce: HexString } => {
  return { nonce: toPjsHex(compact.dec(value)) }
}

export const CheckTxVersion = ({
  additionalSigned,
}: SignedExtension): { transactionVersion: HexString } => {
  return { transactionVersion: toPjsHex(u32.dec(additionalSigned)) }
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
    ...(tip > 0n ? { tip: toPjsHex(tip) } : {}),
  }
}

export const ChargeTransactionPayment = ({
  value,
}: SignedExtension): { tip: HexString } => ({
  tip: toPjsHex(compactBn.dec(value)),
})

export const CheckMortality = (
  { value, additionalSigned }: SignedExtension,
  blockNumber: number,
): { era: HexString; blockHash: HexString; blockNumber: HexString } => ({
  era: toHex(value),
  blockHash: toHex(additionalSigned),
  blockNumber: toPjsHex(blockNumber),
})

export const CheckSpecVersion = ({
  additionalSigned,
}: SignedExtension): { specVersion: HexString } => ({
  specVersion: toPjsHex(u32.dec(additionalSigned)),
})
