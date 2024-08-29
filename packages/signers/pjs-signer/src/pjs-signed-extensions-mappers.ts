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

const toPjsHex = (value: number | bigint, minByteLen?: number) => {
  let inner = value.toString(16)
  inner = (inner.length % 2 ? "0" : "") + inner
  const nPaddedBytes = Math.max(0, (minByteLen || 0) - inner.length / 2)
  return "0x" + "00".repeat(nPaddedBytes) + inner
}

export const CheckGenesis = ({
  additionalSigned,
}: SignedExtension): { genesisHash: string } => ({
  genesisHash: toHex(additionalSigned),
})

export const CheckNonce = ({
  value,
}: SignedExtension): { nonce: HexString } => {
  // nonce is a u32 in pjs => 4 bytes
  return { nonce: toPjsHex(compact.dec(value), 4) }
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
  value,
}: SignedExtension): { aseetId?: string; tip?: string } => {
  const { tip, asset } = assetTxPaymentDec(value)

  return {
    ...(asset ? { assetId: toHex(asset) } : {}),
    tip: toPjsHex(tip, 16),
  }
}

export const ChargeTransactionPayment = ({
  value,
}: SignedExtension): { tip: HexString } => ({
  tip: toPjsHex(compactBn.dec(value), 16), // u128 => 16 bytes
})

export const CheckMortality = (
  { value, additionalSigned }: SignedExtension,
  blockNumber: number,
): { era: HexString; blockHash: HexString; blockNumber: HexString } => ({
  era: toHex(value),
  blockHash: toHex(additionalSigned),
  blockNumber: toPjsHex(blockNumber, 4),
})

export const CheckSpecVersion = ({
  additionalSigned,
}: SignedExtension): { specVersion: HexString } => ({
  specVersion: toPjsHex(u32.dec(additionalSigned), 4),
})

export const CheckMetadataHash = ({
  value,
  additionalSigned,
}: SignedExtension): { mode?: number; metadataHash?: HexString } =>
  value.length && value[0]
    ? {
        mode: 1,
        metadataHash: toHex(
          additionalSigned.length
            ? additionalSigned.slice(1)
            : additionalSigned,
        ),
      }
    : {}
