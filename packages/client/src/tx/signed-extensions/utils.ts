import {
  getDynamicBuilder,
  MetadataLookup,
} from "@polkadot-api/metadata-builders"
import { of } from "rxjs"

export const empty = new Uint8Array()
export const zero = Uint8Array.from([0])
export const systemVersionProp$ = (
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

  return of(valueEnc(systemVersionDec(constant.value)[propName]))
}

export const value = (value: Uint8Array) => ({
  value,
  additionalSigned: empty,
})
export const additionalSigned = (additionalSigned: Uint8Array) => ({
  value: empty,
  additionalSigned,
})
export const both = (value: Uint8Array, additionalSigned: Uint8Array) => ({
  value,
  additionalSigned,
})
