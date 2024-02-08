import {
  getChecksumBuilder,
  getDynamicBuilder,
} from "@polkadot-api/metadata-builders"
import {
  AccountId,
  Codec,
  Decoder,
  SS58String,
  Tuple,
  V14,
  compact,
  metadata,
} from "@polkadot-api/substrate-bindings"
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
  metadata: V14
  checksumBuilder: ReturnType<typeof getChecksumBuilder>
  dynamicBuilder: ReturnType<typeof getDynamicBuilder>
  events: {
    key: string
    dec: Decoder<Array<SystemEvent>>
  }
  accountId: Codec<SS58String>
}

export interface Runtime {
  at: string
  runtime: Observable<RuntimeContext>
  addBlock: (block: string) => Runtime
  deleteBlocks: (blocks: string[]) => number
  usages: Set<string>
}

const opaqueMeta = Tuple(compact, metadata)

export const getRuntimeCreator =
  (call$: (hash: string, method: string, args: string) => Observable<string>) =>
  (hash: string): Runtime => {
    const usages = new Set<string>([hash])

    const runtimeContext$: Observable<RuntimeContext> = call$(
      hash,
      "Metadata_metadata",
      "",
    ).pipe(
      map((response) => {
        const metadata = opaqueMeta.dec(response)[1]
        if (metadata.metadata.tag !== "v14")
          throw new Error("Wrong metadata version")
        const v14 = metadata.metadata.value
        const checksumBuilder = getChecksumBuilder(v14)
        const dynamicBuilder = getDynamicBuilder(v14)
        const events = dynamicBuilder.buildStorage("System", "Events")
        return {
          metadata: v14,
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
