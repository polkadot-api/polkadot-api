import {
  getDynamicBuilder,
  MetadataLookup,
} from "@polkadot-api/metadata-builders"

export const empty = new Uint8Array()

export const signedExtension = (
  value: Uint8Array,
  additionalSigned: Uint8Array,
) => ({
  value,
  additionalSigned,
})
export const systemVersionProp = (
  propName: string,
  lookupFn: MetadataLookup,
) => {
  const dynamicBuilder = getDynamicBuilder(lookupFn)

  const constant = lookupFn.metadata.pallets
    .find((x) => x.name === "System")!
    .constants!.find((s) => s.name === "Version")!

  const systemVersion = lookupFn(constant.type)
  const systemVersionDec = dynamicBuilder.buildDefinition(constant.type).dec

  if (systemVersion.type !== "struct") throw new Error("not a struct")

  const valueEnc = dynamicBuilder.buildDefinition(
    systemVersion.value[propName].id,
  ).enc

  return valueEnc(systemVersionDec(constant.value)[propName])
}

export const EMPTY_SIGNED_EXTENSION = signedExtension(empty, empty)
