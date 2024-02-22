import {
  getChecksumBuilder,
  getDynamicBuilder,
  getLookupFn,
} from "@polkadot-api/metadata-builders"
import {
  AccountId,
  Codec,
  Decoder,
  SS58String,
  Tuple,
  Option,
  V15,
  compact,
  metadata,
  u32,
  Encoder,
  _void,
} from "@polkadot-api/substrate-bindings"
import { toHex } from "@polkadot-api/utils"
import { Observable, map, shareReplay } from "rxjs"

export type SystemEvent = {
  phase:
    | { type: "ApplyExtrinsic"; value: number }
    | { type: "Finalization" }
    | { type: "Initialization" }
  event: {
    type: string
    value: {
      type: string
      value: any
    }
  }
  topics: Array<any>
}

export interface RuntimeContext {
  metadata: V15
  checksumBuilder: ReturnType<typeof getChecksumBuilder>
  dynamicBuilder: ReturnType<typeof getDynamicBuilder>
  events: {
    key: string
    dec: Decoder<Array<SystemEvent>>
  }
  accountId: Codec<SS58String>
  asset: [Encoder<any>, string | null]
}

export interface Runtime {
  at: string
  runtime: Observable<RuntimeContext>
  addBlock: (block: string) => Runtime
  deleteBlocks: (blocks: string[]) => number
  usages: Set<string>
}

const opaqueMeta = Option(Tuple(compact, metadata))

const v15Args = toHex(u32.enc(15))
export const getRuntimeCreator =
  (call$: (hash: string, method: string, args: string) => Observable<string>) =>
  (hash: string): Runtime => {
    const usages = new Set<string>([hash])

    const runtimeContext$: Observable<RuntimeContext> = call$(
      hash,
      "Metadata_metadata_at_version",
      v15Args,
    ).pipe(
      map((response) => {
        const metadata = opaqueMeta.dec(response)![1]
        if (metadata.metadata.tag !== "v15")
          throw new Error("Wrong metadata version")
        const v15 = metadata.metadata.value
        const checksumBuilder = getChecksumBuilder(v15)
        const dynamicBuilder = getDynamicBuilder(v15)
        const events = dynamicBuilder.buildStorage("System", "Events")

        const assetPayment =
          metadata.metadata.value.extrinsic.signedExtensions.find(
            (x) => x.identifier === "ChargeAssetTxPayment",
          )

        let _assetId: null | number = null
        if (assetPayment) {
          const assetTxPayment = getLookupFn(metadata.metadata.value.lookup)(
            assetPayment.type,
          )
          if (assetTxPayment.type === "struct") {
            const optionalAssetId = assetTxPayment.value.asset_id
            if (optionalAssetId.type === "option")
              _assetId = optionalAssetId.value.id
          }
        }

        const asset: [Encoder<any>, string | null] =
          _assetId === null
            ? [_void.enc, null]
            : [
                dynamicBuilder.buildDefinition(_assetId).enc,
                checksumBuilder.buildDefinition(_assetId),
              ]

        return {
          asset,
          metadata: v15,
          checksumBuilder,
          dynamicBuilder,
          events: {
            key: events.enc(),
            dec: events.dec as any,
          },
          accountId: AccountId(dynamicBuilder.ss58Prefix),
        }
      }),
      shareReplay(1),
    )

    const result: Runtime = {
      at: hash,
      runtime: runtimeContext$,
      addBlock: (block: string) => {
        usages.add(block)
        return result
      },
      deleteBlocks: (blocks) => {
        blocks.forEach((block) => {
          usages.delete(block)
        })
        return usages.size
      },
      usages,
    }
    runtimeContext$.subscribe()

    return result
  }
