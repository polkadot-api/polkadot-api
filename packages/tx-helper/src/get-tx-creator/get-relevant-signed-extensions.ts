import { V14, _void } from "@polkadot-api/substrate-bindings"
import {
  getChecksumBuilder,
  getDynamicBuilder,
} from "@polkadot-api/metadata-builders"
import {
  chainSignedExtensions,
  userSignedExtensions,
} from "@/signed-extensions"
import type { UserSignedExtensionName } from "@/."

export const getRelevantSignedExtensions = (metadata: V14) => {
  const checksumBuilder = getChecksumBuilder(metadata)
  const dynamicBuilder = getDynamicBuilder(metadata)

  const getDefinition = (type: number) => ({
    codec: dynamicBuilder.buildDefinition(type),
    checksum: checksumBuilder.buildDefinition(type),
  })

  const relevant = metadata.extrinsic.signedExtensions
    .map(({ identifier, type, additionalSigned }) => ({
      identifier,
      type: getDefinition(type),
      additionalSigned: getDefinition(additionalSigned),
    }))
    .filter((v) => v.type.codec !== _void || v.additionalSigned.codec !== _void)

  const user: Array<UserSignedExtensionName> = []
  const chain: Array<"CheckGenesis" | "CheckNonce" | "CheckSpecVersion"> = []
  const unknown: Array<string> = []

  const all: Array<string> = relevant.map((x) => x.identifier)

  all.forEach((sExtension) => {
    if (chainSignedExtensions[sExtension as "CheckGenesis"])
      chain.push(sExtension as any)
    else if (userSignedExtensions[sExtension as "CheckMortality"])
      user.push(sExtension as any)
    else unknown.push(sExtension)
  })

  return { all, user, chain, unknown }
}
