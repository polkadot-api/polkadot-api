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
import type { CommonOpts } from "../common"
import { compact } from "@polkadot-api/substrate-bindings"

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
  (opts: {
    bindings: TxCreatorBindings
    context: TxPayloadV1["context"]
    lookupFn: MetadataLookup
    dynamicBuilder: ReturnType<typeof getDynamicBuilder>
    opts: CommonOpts
  }) => Promise<{ extra: string; additionalSigned: string }>
> = {
  CheckGenesis: async ({ context: { genesisHash } }) =>
    additionalSigned(genesisHash),
  CheckMetadataHash: async () => both(zero, zero),
  CheckSpecVersion: async ({ lookupFn, dynamicBuilder }) =>
    additionalSigned(
      getSystemVersionProp(
        lookupFn,
        dynamicBuilder,
        "CheckSpecVersion",
        "spec_version",
      ),
    ),

  CheckTxVersion: async ({ lookupFn, dynamicBuilder }) =>
    additionalSigned(
      getSystemVersionProp(
        lookupFn,
        dynamicBuilder,
        "CheckTxVersion",
        "transaction_version",
      ),
    ),
  CheckMortality: async ({
    bindings: { blocks },
    context: { genesisHash },
    opts: { mortality },
  }) => {
    if (mortality?.mortal === false) return both(zero, genesisHash)
    const period = mortality?.period ?? 20
    const { finalized, tips } = await firstValueFrom(blocks)
    const higherHeight = Math.max(...tips.map(({ number }) => number))
    const heightDiff = higherHeight - finalized.number
    return both(
      toHex(
        mortal({ period: heightDiff + period, startAtBlock: finalized.number }),
      ),
      finalized.hash,
    )
  },
  ChargeTransactionPayment: async ({ opts: { tip } }) =>
    value(toHex(compact.enc(tip ?? 0))),
}
