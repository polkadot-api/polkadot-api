import {
  getDynamicBuilder,
  MetadataLookup,
} from "@polkadot-api/metadata-builders"
import { Encoder } from "@polkadot-api/substrate-bindings"

export const getSystemVersionProp = (
  lookupFn: MetadataLookup,
  dynamicBuilder: ReturnType<typeof getDynamicBuilder>,
  enc: Encoder<any>,
  field: string,
) => {
  const constant = lookupFn.metadata.pallets
    .find((x) => x.name === "System")!
    .constants!.find((s) => s.name === "Version")!

  const systemVersion = lookupFn(constant.type)
  const systemVersionDec = dynamicBuilder.buildDefinition(constant.type).dec

  if (systemVersion.type !== "struct") throw new Error("not a struct")
  return enc(systemVersionDec(constant.value)[field])
}
