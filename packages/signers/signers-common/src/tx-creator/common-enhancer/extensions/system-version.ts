import {
  getDynamicBuilder,
  MetadataLookup,
} from "@polkadot-api/metadata-builders"
import { toHex } from "@polkadot-api/utils"

export const getSystemVersionProp = (
  lookupFn: MetadataLookup,
  dynamicBuilder: ReturnType<typeof getDynamicBuilder>,
  extensionName: string,
  fieldName: string,
) => {
  const { enc } = dynamicBuilder.buildDefinition(
    lookupFn.metadata.extrinsic.signedExtensions[0].find(
      ({ identifier }) => identifier === extensionName,
    )!.additionalSigned,
  )
  const constant = lookupFn.metadata.pallets
    .find((x) => x.name === "System")!
    .constants!.find((s) => s.name === "Version")!

  const systemVersion = lookupFn(constant.type)
  const systemVersionDec = dynamicBuilder.buildDefinition(constant.type).dec

  if (systemVersion.type !== "struct") throw new Error("not a struct")
  return toHex(enc(systemVersionDec(constant.value)[fieldName]))
}
