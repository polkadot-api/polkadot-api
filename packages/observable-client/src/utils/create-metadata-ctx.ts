import type { RuntimeContext } from "@/chainHead"
import {
  AccountId,
  Bytes,
  compactNumber,
  createDecoder,
  Decoder,
  DecoderType,
  enhanceDecoder,
  extrinsicFormat,
  StringRecord,
  Struct,
  u16,
  u8,
  type UnifiedMetadata,
} from "@polkadot-api/substrate-bindings"
import { getDynamicBuilder, getLookupFn } from "@polkadot-api/metadata-builders"

const CHECK_MORTALITY = "CheckMortality"

export const createRuntimeCtx = (
  metadata: UnifiedMetadata,
  metadataRaw: Uint8Array,
  codeHash: string,
): RuntimeContext => {
  const lookup = getLookupFn(metadata)
  const dynamicBuilder = getDynamicBuilder(lookup)
  const events = dynamicBuilder.buildStorage("System", "Events")

  const assetPayment = metadata.extrinsic.signedExtensions.find(
    (x) => x.identifier === "ChargeAssetTxPayment",
  )

  let assetId: null | number = null
  if (assetPayment) {
    const assetTxPayment = lookup(assetPayment.type)
    if (assetTxPayment.type === "struct") {
      const optionalAssetId = assetTxPayment.value.asset_id
      if (optionalAssetId.type === "option") assetId = optionalAssetId.value.id
    }
  }

  const extrinsicDecoder = getExtrinsicDecoder(lookup.metadata, dynamicBuilder)
  const getMortalityFromTx: typeof mortalityDecoder = (tx) => {
    const decodedExt = extrinsicDecoder(tx)
    return (
      ("extra" in decodedExt &&
        (decodedExt.extra[CHECK_MORTALITY] as
          | DecoderType<typeof mortalityDecoder>
          | undefined)) || { mortal: false }
    )
  }

  return {
    assetId,
    metadataRaw,
    codeHash,
    lookup,
    dynamicBuilder,
    events: {
      key: events.keys.enc(),
      dec: events.value.dec as any,
    },
    accountId: AccountId(dynamicBuilder.ss58Prefix),
    getMortalityFromTx,
    extVersions: metadata.extrinsic.version,
  }
}

// TODO: put all the logic that follows in a generic enough low-level package
const allBytesDec = Bytes(Infinity).dec

type DecodedExtrinsic = {
  len: number
  callData: Uint8Array
} & (
  | { version: 4 | 5; type: "bare" }
  | {
      version: 4
      type: "signed"
      address: any
      signature: any
      extra: Record<string, any>
    }
  | {
      version: 5
      type: "general"
      extensionVersion: number
      extra: Record<string, any>
    }
)

const mortalDecoder = enhanceDecoder(u16[1], (input) => {
  const period = 2 << input % (1 << 4)
  const factor = Math.max(period >> 12, 1)
  const phase = (input >> 4) * factor
  return { mortal: true as const, period, phase }
})

const mortalityDecoder = createDecoder((value) => {
  const firstByte = u8.dec(value)
  if (firstByte === 0) return { mortal: false as const }
  const secondByte = u8.dec(value)
  return mortalDecoder(Uint8Array.from([firstByte, secondByte]))
})

const getExtrinsicDecoder = (
  metadata: UnifiedMetadata,
  dynamicBuilder: ReturnType<typeof getDynamicBuilder>,
): Decoder<DecodedExtrinsic> => {
  const innerExtra = Object.fromEntries(
    metadata.extrinsic.signedExtensions.map(
      (x) =>
        [
          x.identifier,
          x.identifier === CHECK_MORTALITY
            ? mortalityDecoder
            : dynamicBuilder.buildDefinition(x.type)[1],
        ] as [string, Decoder<any>],
    ),
  ) as StringRecord<Decoder<any>>

  let address: Decoder<any>
  let signature: Decoder<any>
  const { extrinsic } = metadata
  if ("address" in extrinsic) {
    // v15/v16
    address = dynamicBuilder.buildDefinition(extrinsic.address)[1]
    signature = dynamicBuilder.buildDefinition(extrinsic.signature)[1]
  } else {
    // v14
    const params = metadata.lookup[extrinsic.type]?.params
    const _call = params?.find((v) => v.name === "Call")?.type
    const addr = params?.find((v) => v.name === "Address")?.type
    const sig = params?.find((v) => v.name === "Signature")?.type
    if (_call == null || addr == null || sig == null)
      throw new Error("Call, Address and/or signature not found")
    address = dynamicBuilder.buildDefinition(addr)[1]
    signature = dynamicBuilder.buildDefinition(sig)[1]
  }

  const v4Body = Struct.dec({
    address,
    signature,
    extra: Struct.dec(innerExtra),
    callData: allBytesDec,
  })

  return createDecoder((data) => {
    const len = compactNumber.dec(data)
    const { type, version } = extrinsicFormat[1](data)
    if (type === "bare")
      return { len, version, type, callData: allBytesDec(data) }
    if (type === "signed") return { len, version, type, ...v4Body(data) }

    const extensionVersion = u8.dec(data)
    let extraDec: Decoder<StringRecord<any>>
    if (metadata.version === 16) {
      const extensionsToApply = (
        metadata as UnifiedMetadata<16>
      ).extrinsic.signedExtensionsByVersion.find(
        ([x]) => x === extensionVersion,
      )
      if (!extensionsToApply) throw new Error("Unexpected extension version")
      extraDec = Struct.dec(
        Object.fromEntries(
          Object.entries(innerExtra).filter((_, idx) =>
            extensionsToApply[1].includes(idx),
          ),
        ) as StringRecord<Decoder<any>>,
      )
    } else extraDec = Struct.dec(innerExtra)
    const extra = extraDec(data)

    return {
      len,
      type,
      version,
      extensionVersion,
      extra,
      callData: allBytesDec(data),
    }
  }) as any
}
