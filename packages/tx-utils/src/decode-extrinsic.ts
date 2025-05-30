import {
  Bin,
  Binary,
  compactNumber,
  createDecoder,
  Decoder,
  enhanceDecoder,
  Enum,
  extrinsicFormat,
  StringRecord,
  Struct,
  u8,
  UnifiedMetadata,
} from "@polkadot-api/substrate-bindings"
import { getMetadata } from "./get-metadata"
import { getDynamicBuilder, getLookupFn } from "@polkadot-api/metadata-builders"

const allBytesDec = Bin(Infinity).dec

export type DecodedExtrinsic = {
  len: number
  callData: Binary
  call: Enum<Enum<any>>
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
export const getExtrinsicDecoder = (
  metadataRaw: Uint8Array,
): Decoder<DecodedExtrinsic> => {
  const metadata = getMetadata(metadataRaw)
  const lookup = getLookupFn(metadata)
  const dynamicBuilder = getDynamicBuilder(lookup)

  const innerExtra = Object.fromEntries(
    metadata.extrinsic.signedExtensions.map(
      (x) =>
        [x.identifier, dynamicBuilder.buildDefinition(x.type)[1]] as [
          string,
          Decoder<any>,
        ],
    ),
  ) as StringRecord<Decoder<any>>

  let call: Decoder<any>
  let address: Decoder<any>
  let signature: Decoder<any>
  const { extrinsic } = metadata
  if ("address" in extrinsic) {
    // v15/v16
    call = dynamicBuilder.buildDefinition(extrinsic.call)[1]
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
    call = dynamicBuilder.buildDefinition(_call)[1]
    address = dynamicBuilder.buildDefinition(addr)[1]
    signature = dynamicBuilder.buildDefinition(sig)[1]
  }

  const v4Body = Struct.dec({
    address,
    signature,
    extra: Struct.dec(innerExtra),
    callData: allBytesDec,
  })

  return enhanceDecoder(
    createDecoder((data) => {
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
    }),
    (v) =>
      ({
        ...v,
        call: call(v.callData.asBytes()),
      }) as any,
  )
}
