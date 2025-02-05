import {
  getDynamicBuilder,
  MetadataLookup,
} from "@polkadot-api/metadata-builders"

type DynamicBuilder = ReturnType<typeof getDynamicBuilder>
export const getSystemVersionStruct = (
  lookupFn: MetadataLookup,
  dynamicBuilder: DynamicBuilder,
): Record<string, any> => {
  const constant = lookupFn.metadata.pallets
    .find((x) => x.name === "System")!
    .constants!.find((s) => s.name === "Version")!

  const systemVersion = lookupFn(constant.type)
  const systemVersionDec = dynamicBuilder.buildDefinition(constant.type).dec

  if (systemVersion.type !== "struct") throw new Error("not a struct")
  return systemVersionDec(constant.value)
}
