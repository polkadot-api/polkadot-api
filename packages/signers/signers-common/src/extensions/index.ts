import { TxCreatorBindings } from "@/tx-creator"
import {
  getDynamicBuilder,
  MetadataLookup,
} from "@polkadot-api/metadata-builders"
import { TxPayloadV1 } from "@polkadot-api/polkadot-signer"
import { getSystemVersionProp } from "./system-version"
import { firstValueFrom } from "rxjs"
import { mortal } from "./mortal-enc"
import { fromHex } from "@polkadot-api/utils"
import { compact } from "@polkadot-api/substrate-bindings"

const empty = Uint8Array.from([])
const zero = Uint8Array.from([0])
const value = (value: Uint8Array) => ({
  value,
  additionalSigned: empty,
})
const additionalSigned = (additionalSigned: Uint8Array) => ({
  value: empty,
  additionalSigned,
})
const both = (value: Uint8Array, additionalSigned: Uint8Array) => ({
  value,
  additionalSigned,
})

export const extensions: Record<
  string,
  (
    bindings: TxCreatorBindings,
    context: TxPayloadV1["context"],
    lookupFn: MetadataLookup,
    dynamicBuilder: ReturnType<typeof getDynamicBuilder>,
  ) => Promise<{ value: Uint8Array; additionalSigned: Uint8Array }>
> = {
  CheckGenesis: async (_, { genesisHash }) =>
    additionalSigned(fromHex(genesisHash)),
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
      mortal({ period: 64, startAtBlock: finalized.number }),
      fromHex(finalized.hash),
    )
  },
  ChargeTransactionPayment: async () => value(compact.enc(0)),
}
