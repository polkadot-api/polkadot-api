import {
  getDynamicBuilder,
  MetadataLookup,
} from "@polkadot-api/metadata-builders"
import { TxPayloadV1 } from "@polkadot-api/polkadot-signer"
import { getSystemVersionProp } from "./system-version"
import { firstValueFrom } from "rxjs"
import { mortal } from "./mortal-enc"
import { toHex } from "@polkadot-api/utils"
import { TxCreatorBindings } from "../types"

const empty = "0x"
const zero = "0x00"
const value = (extra: string) => ({
  extra,
  additionalSigned: empty,
})
const additionalSigned = (additionalSigned: string) => ({
  extra: empty,
  additionalSigned,
})
const both = (extra: string, additionalSigned: string) => ({
  extra,
  additionalSigned,
})

export const extensions: Record<
  string,
  (
    bindings: TxCreatorBindings,
    context: TxPayloadV1["context"],
    lookupFn: MetadataLookup,
    dynamicBuilder: ReturnType<typeof getDynamicBuilder>,
  ) => Promise<{ extra: string; additionalSigned: string }>
> = {
  CheckGenesis: async (_, { genesisHash }) => additionalSigned(genesisHash),
  CheckMetadataHash: async () => both(zero, zero),
  CheckSpecVersion: async (_, __, lookupFn, dynamicBuilder) => {
    const { enc } = dynamicBuilder.buildDefinition(
      lookupFn.metadata.extrinsic.signedExtensions[0].find(
        ({ identifier }) => identifier === "CheckSpecVersion",
      )!.additionalSigned,
    )
    return additionalSigned(
      getSystemVersionProp(lookupFn, dynamicBuilder, enc, "spec_version"),
    )
  },
  CheckTxVersion: async (_, __, lookupFn, dynamicBuilder) => {
    const { enc } = dynamicBuilder.buildDefinition(
      lookupFn.metadata.extrinsic.signedExtensions[0].find(
        ({ identifier }) => identifier === "CheckTxVersion",
      )!.additionalSigned,
    )
    return additionalSigned(
      getSystemVersionProp(
        lookupFn,
        dynamicBuilder,
        enc,
        "transaction_version",
      ),
    )
  },
  CheckMortality: async ({ blocks }) => {
    const { finalized } = await firstValueFrom(blocks)
    return both(
      toHex(mortal({ period: 64, startAtBlock: finalized.number })),
      finalized.hash,
    )
  },
  ChargeTransactionPayment: async () => value(zero),
}
