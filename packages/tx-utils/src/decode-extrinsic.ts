import {
  AccountId,
  Bin,
  compactNumber,
  createDecoder,
  Decoder,
  enhanceDecoder,
  StringRecord,
  Struct,
  u8,
  Variant,
} from "@polkadot-api/substrate-bindings"
import { getMetadata } from "./get-metadata"
import { getDynamicBuilder, getLookupFn } from "@polkadot-api/metadata-builders"

const versionDec = enhanceDecoder(u8[1], (value) => ({
  version: value & ~(1 << 7),
  signed: !!(value & (1 << 7)),
}))

const allBytesDec = Bin(Infinity).dec

const getDefaultAddress = (prefix: number | undefined) =>
  Variant({
    Id: AccountId(prefix),
    Raw: Bin(),
    Address32: Bin(32),
    Address20: Bin(20),
  }).dec

const defaultSignature = Variant({
  Ed25519: Bin(64),
  Sr25519: Bin(64),
  Ecdsa: Bin(65),
}).dec

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

  let address: Decoder<any> = getDefaultAddress(dynamicBuilder.ss58Prefix)
  let signature: Decoder<any> = defaultSignature
  const { extrinsic } = metadata
  if ("address" in extrinsic) {
    address = dynamicBuilder.buildDefinition(extrinsic.address)[1]
    signature = dynamicBuilder.buildDefinition(extrinsic.signature)[1]
  }

  const body = Struct.dec({ address, signature, extra, callData: allBytesDec })

  return createDecoder((data) => {
    const len = compactNumber.dec(data)
    const { signed, version } = versionDec(data)
    if (!signed) return { len, signed, version, callData: allBytesDec(data) }
    return { len, signed, version, ...body(data) }
  })
}
