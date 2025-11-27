import {
  _void,
  Blake2256,
  compactBn,
  compactNumber,
  createDecoder,
  Decoder,
  HexString,
  u16,
  u32,
  u8,
} from "@polkadot-api/substrate-bindings"
import { getMetadata } from "./get-metadata"
import { getDynamicBuilder, getLookupFn } from "@polkadot-api/metadata-builders"
import { SignerPayloadJSON, TxInputDecoded, TxInputsRaw } from "./types"
import { fromPjsToTxData } from "./from-pjs-to-tx-data"
import { SignedExtension } from "./signed-extensions/internal-types"
import {
  CheckGenesis,
  CheckMetadataHash,
  CheckNonce,
  CheckSpecVersion,
  CheckTxVersion,
} from "./signed-extensions/chain"
import {
  ChargeAssetTxPayment,
  ChargeTransactionPayment,
  CheckMortality,
} from "./signed-extensions/user"
import { EMPTY_SIGNED_EXTENSION } from "./signed-extensions/utils"
import { fromHex, mergeUint8, toHex } from "@polkadot-api/utils"
import { createV4Tx } from "@polkadot-api/signers-common"
import { merkleizeMetadata } from "@polkadot-api/merkleize-metadata"

const getHeightStart = (
  { period, phase }: { period: number; phase: number },
  topHeight: number,
) => Math.floor((Math.max(topHeight, phase) - phase) / period) * period + phase

const mortalityDec = createDecoder((value) => {
  const firstByte = u8.dec(value)
  if (!firstByte) return null
  const secondByte = u8.dec(value)
  const enc = u16.dec(Uint8Array.from([firstByte, secondByte]))
  const period = 2 << enc % (1 << 4)
  const factor = Math.max(period >> 12, 1)
  const phase = (enc >> 4) * factor
  return { period, phase }
})

export const getTxHelper = (
  metadataRaw: HexString,
  token?: { decimals: number; tokenSymbol: string },
) => {
  const metadata = getMetadata(metadataRaw)
  const metadataHash = token
    ? merkleizeMetadata(metadataRaw, token).digest()
    : null

  const lookup = getLookupFn(metadata)
  const dynamicBuilder = getDynamicBuilder(lookup)

  const { extrinsic } = metadata
  let call: Decoder<any>
  if ("address" in extrinsic) {
    // v15/v16
    call = dynamicBuilder.buildDefinition(extrinsic.call)[1]
  } else {
    // v14
    const params = metadata.lookup[extrinsic.type]?.params
    const _call = params?.find((v) => v.name === "Call")?.type
    if (_call == null) throw new Error("Call not found")
    call = dynamicBuilder.buildDefinition(_call)[1]
  }

  const extensionsDec = Object.fromEntries(
    metadata.extrinsic.signedExtensions.map(
      (x) =>
        [
          x.identifier,
          {
            extra: dynamicBuilder.buildDefinition(x.type)[1],
            additionalSigned: dynamicBuilder.buildDefinition(
              x.additionalSigned,
            )[1],
          },
        ] as [string, { extra: Decoder<any>; additionalSigned: Decoder<any> }],
    ),
  ) as Record<string, { extra: Decoder<any>; additionalSigned: Decoder<any> }>

  const fromPjsToInputRaw = (
    pjsPayload: SignerPayloadJSON,
  ): { input: TxInputsRaw; blockNumber: number } => {
    const { tip, mortality, genesisHash, nonce, asset } = fromPjsToTxData(
      lookup.metadata,
      pjsPayload,
    )

    const signedExtensions = lookup.metadata.extrinsic.signedExtensions.map(
      ({ identifier, type, additionalSigned }): SignedExtension => {
        switch (identifier) {
          case "CheckGenesis":
            return CheckGenesis(genesisHash)
          case "CheckMetadataHash":
            return CheckMetadataHash(metadataHash)
          case "CheckNonce":
            return CheckNonce(nonce)
          case "CheckSpecVersion":
            return CheckSpecVersion(lookup)
          case "ChargeAssetTxPayment":
            return ChargeAssetTxPayment(tip, asset)
          case "ChargeTransactionPayment":
            return ChargeTransactionPayment(tip)
          case "CheckMortality":
            return CheckMortality(mortality)
          case "CheckTxVersion":
            return CheckTxVersion(lookup)
        }

        if (
          dynamicBuilder.buildDefinition(type) === _void &&
          dynamicBuilder.buildDefinition(additionalSigned) === _void
        )
          return EMPTY_SIGNED_EXTENSION
        throw new Error(`Unsupported signed-extension: ${identifier}`)
      },
    )

    return {
      input: {
        callData: fromHex(pjsPayload.method),
        extensions: signedExtensions.map(
          ({ value: extra, additionalSigned }, idx) => ({
            id: lookup.metadata.extrinsic.signedExtensions[idx].identifier,
            extra,
            additionalSigned,
          }),
        ),
      },
      blockNumber: parseInt(pjsPayload.blockNumber, 16),
    }
  }

  const getTxInputDecoded = (
    { callData, extensions }: TxInputsRaw,
    currentHeight: number,
  ): TxInputDecoded => {
    let tip: bigint = 0n
    let asset: any = null
    let genesisHash = ""
    let nonce = -1
    let specVersion = -1
    let txVersion = -1
    let mortality: null | {
      from: { hash: string; height: number }
      to: number
    } = null

    const method = call(callData)
    const others = Object.fromEntries(
      extensions
        .filter((x) => x.extra.length || x.additionalSigned.length)
        .filter(({ id, extra, additionalSigned }) => {
          if (id === "ChargeAssetTxPayment") {
            const asstTxPayment: { tip: bigint; asset_id: any } =
              extensionsDec.ChargeAssetTxPayment.extra(extra)
            tip = asstTxPayment.tip
            asset = asstTxPayment.asset_id
            return false
          }

          if (id === "ChargeTransactionPayment") {
            tip = compactBn.dec(extra)
            return false
          }

          if (id === "CheckGenesis") {
            genesisHash = toHex(additionalSigned)
            return false
          }

          if (id === "CheckNonce") {
            nonce = compactNumber.dec(extra)
            return false
          }

          if (id === "CheckMortality") {
            const phasePeriod = mortalityDec(extra)
            if (phasePeriod) {
              const height = getHeightStart(phasePeriod, currentHeight)
              mortality = {
                from: {
                  height,
                  hash: toHex(additionalSigned),
                },
                to: height + phasePeriod.period,
              }
            }
            return false
          }

          if (id === "CheckSpecVersion") {
            specVersion = u32.dec(additionalSigned)
            return false
          }

          if (id === "CheckTxVersion") {
            txVersion = u32.dec(additionalSigned)
            return false
          }

          return true
        })
        .map(({ id, additionalSigned, extra }) => {
          const add = extensionsDec[id].additionalSigned(additionalSigned)
          const ext = extensionsDec[id].extra(extra)
          if (add !== undefined && ext !== undefined)
            return {
              id,
              value: {
                extra: ext,
                additionalSigned: add,
              },
            }
          if (add === undefined && ext === undefined)
            return { id, value: undefined }

          return { id, value: add === undefined ? ext : add }
        })
        .filter((x) => x.value !== undefined)
        .map(({ id, value }) => [id, value] as [string, any]),
    )

    return {
      genesisHash,
      specVersion,
      txVersion,
      method,
      nonce,
      mortality,
      tip,
      asset,
      others,
    }
  }

  const createTxV4 = async (
    { callData, extensions }: TxInputsRaw,
    publicKey: Uint8Array,
    signingType: "Ecdsa" | "Ed25519" | "Sr25519",
    sign: (input: Uint8Array) => Uint8Array | Promise<Uint8Array>,
  ): Promise<Uint8Array> => {
    const { version } = lookup.metadata.extrinsic
    const checkedVersion = version.includes(4) ? 4 : null
    if (checkedVersion == null) throw new Error("Extrinsic v4 not supported")

    let extraParts: Uint8Array[] = []
    let additionalSignedParts: Uint8Array[] = []
    extensions.forEach(({ extra, additionalSigned }) => {
      extraParts.push(extra)
      additionalSignedParts.push(additionalSigned)
    })

    const toSign = mergeUint8([
      callData,
      mergeUint8(extraParts),
      mergeUint8(additionalSignedParts),
    ])

    return createV4Tx(
      metadata,
      publicKey,
      await sign(toSign.length > 256 ? Blake2256(toSign) : toSign),
      extraParts,
      callData,
      signingType,
    )
  }

  return {
    fromPjsToInputRaw,
    getTxInputDecoded,
    createTxV4,
  }
}
