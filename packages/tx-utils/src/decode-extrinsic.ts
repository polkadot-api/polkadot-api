import {
  Bin,
  compactNumber,
  createDecoder,
  Decoder,
  enhanceDecoder,
  StringRecord,
  Struct,
  u8,
} from "@polkadot-api/substrate-bindings"
import { getMetadata } from "./get-metadata"
import { getDynamicBuilder, getLookupFn } from "@polkadot-api/metadata-builders"

const versionDec = enhanceDecoder(u8[1], (value) => ({
  version: value & ~(1 << 7),
  signed: !!(value & (1 << 7)),
}))

const allBytesDec = Bin(Infinity).dec

export const getExtrinsicDecoder = (metadataRaw: Uint8Array) => {
  const metadata = getMetadata(metadataRaw)
  const lookup = getLookupFn(metadata)
  const dynamicBuilder = getDynamicBuilder(lookup)

  const extra: Decoder<Record<string, any>> = Struct.dec(
    Object.fromEntries(
      metadata.extrinsic.signedExtensions.map(
        (x) =>
          [x.identifier, dynamicBuilder.buildDefinition(x.type)[1]] as [
            string,
            Decoder<any>,
          ],
      ),
    ) as StringRecord<Decoder<any>>,
  )

  let address: Decoder<any>
  let signature: Decoder<any>
  const { extrinsic } = metadata
  if ("address" in extrinsic) {
    // v15
    address = dynamicBuilder.buildDefinition(extrinsic.address)[1]
    signature = dynamicBuilder.buildDefinition(extrinsic.signature)[1]
  } else {
    // v14
    const params = metadata.lookup[extrinsic.type]?.params
    const addr = params?.find((v) => v.name === "Address")?.type
    const sig = params?.find((v) => v.name === "Signature")?.type
    if (addr == null || sig == null)
      throw new Error("Address and/or signature not found")
    address = dynamicBuilder.buildDefinition(addr)[1]
    signature = dynamicBuilder.buildDefinition(sig)[1]
  }

  const body = Struct.dec({ address, signature, extra, callData: allBytesDec })

  return createDecoder((data) => {
    const len = compactNumber.dec(data)
    const { signed, version } = versionDec(data)
    if (!signed) return { len, signed, version, callData: allBytesDec(data) }
    return { len, signed, version, ...body(data) }
  })
}
