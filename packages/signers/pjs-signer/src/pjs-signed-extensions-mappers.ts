import { HexString } from "@polkadot-api/substrate-bindings"
import {
  Bytes,
  Struct,
  compact,
  u32,
  Option,
  compactBn,
} from "@polkadot-api/substrate-bindings"
import { fromHex, toHex } from "@polkadot-api/utils"

type SignedExtension = {
  extra: string
  additionalSigned: string
}

const toPjsHex = (value: number | bigint, minByteLen?: number) => {
  let inner = value.toString(16)
  inner = (inner.length % 2 ? "0" : "") + inner
  const nPaddedBytes = Math.max(0, (minByteLen || 0) - inner.length / 2)
  return "0x" + "00".repeat(nPaddedBytes) + inner
}

export const CheckGenesis = ({
  additionalSigned,
}: SignedExtension): { genesisHash: string } => ({
  genesisHash: additionalSigned,
})

export const CheckNonce = ({
  extra,
}: SignedExtension): { nonce: HexString } => {
  // nonce is a u32 in pjs => 4 bytes
  return { nonce: toPjsHex(compact.dec(extra), 4) }
}

export const CheckTxVersion = ({
  additionalSigned,
}: SignedExtension): { transactionVersion: HexString } => {
  return { transactionVersion: toPjsHex(u32.dec(additionalSigned), 4) }
}

const assetTxPaymentDec = Struct({
  tip: compact,
  asset: Option(Bytes(Infinity)),
}).dec

export const ChargeAssetTxPayment = ({
  extra,
}: SignedExtension): { aseetId?: string; tip?: string } => {
  const { tip, asset } = assetTxPaymentDec(extra)

  return {
    ...(asset ? { assetId: toHex(asset) } : {}),
    tip: toPjsHex(tip, 16),
  }
}

export const ChargeTransactionPayment = ({
  extra,
}: SignedExtension): { tip: HexString } => ({
  tip: toPjsHex(compactBn.dec(extra), 16), // u128 => 16 bytes
})

export const CheckMortality = (
  { extra, additionalSigned }: SignedExtension,
  blockNumber: number,
): { era: HexString; blockHash: HexString; blockNumber: HexString } => ({
  era: extra,
  blockHash: additionalSigned,
  blockNumber: toPjsHex(blockNumber, 4),
})

export const CheckSpecVersion = ({
  additionalSigned,
}: SignedExtension): { specVersion: HexString } => ({
  specVersion: toPjsHex(u32.dec(additionalSigned), 4),
})

export const CheckMetadataHash = ({
  extra,
  additionalSigned,
}: SignedExtension): { mode?: number; metadataHash?: HexString } => {
  const extraU8 = fromHex(extra)
  const additionalSignedU8 = fromHex(additionalSigned)
  return extraU8[0]
    ? {
        mode: 1,
        metadataHash: toHex(additionalSignedU8.slice(1)),
      }
    : {}
}
