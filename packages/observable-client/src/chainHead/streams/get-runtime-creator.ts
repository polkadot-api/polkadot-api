import {
  getDynamicBuilder,
  getLookupFn,
  MetadataLookup,
} from "@polkadot-api/metadata-builders"
import {
  AccountId,
  Bytes,
  Codec,
  Decoder,
  metadata as metadataCodec,
  Option,
  SS58String,
  u32,
  V14,
  V15,
  Vector,
} from "@polkadot-api/substrate-bindings"
import { toHex } from "@polkadot-api/utils"
import {
  catchError,
  map,
  mergeMap,
  Observable,
  of,
  shareReplay,
  switchMap,
  take,
} from "rxjs"
import { BlockNotPinnedError } from "../errors"

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
  metadataRaw: Uint8Array
  lookup: MetadataLookup
  dynamicBuilder: ReturnType<typeof getDynamicBuilder>
  events: {
    key: string
    dec: Decoder<Array<SystemEvent>>
  }
  accountId: Codec<SS58String>
  assetId: number | null
}

export interface Runtime {
  at: string
  runtime: Observable<RuntimeContext>
  addBlock: (block: string) => Runtime
  deleteBlocks: (blocks: string[]) => number
  usages: Set<string>
}

const v15Args = toHex(u32.enc(15))
const opaqueBytes = Bytes()
const optionalOpaqueBytes = Option(opaqueBytes)
const u32ListDecoder = Vector(u32).dec

export const getRuntimeCreator = (
  call$: (hash: string, method: string, args: string) => Observable<string>,
  finalized$: Observable<string>,
) => {
  const getMetadata$ = (
    hash: string,
  ): Observable<{ metadataRaw: Uint8Array; metadata: V14 | V15 }> => {
    const recoverCall$ = (
      hash: string,
      method: string,
      args: string,
    ): Observable<string> =>
      call$(hash, method, args).pipe(
        catchError((e) => {
          if (e instanceof BlockNotPinnedError) {
            return finalized$.pipe(
              take(1),
              switchMap((newHash) => recoverCall$(newHash, method, args)),
            )
          }
          throw e
        }),
      )

    const versions = recoverCall$(hash, "Metadata_metadata_versions", "").pipe(
      map(u32ListDecoder),
    )

    const v14 = recoverCall$(hash, "Metadata_metadata", "").pipe(
      map((x) => {
        const metadataRaw = opaqueBytes.dec(x)!
        const metadata = metadataCodec.dec(metadataRaw)
        return { metadata: metadata.metadata.value as V14, metadataRaw }
      }),
    )

    const v15 = recoverCall$(
      hash,
      "Metadata_metadata_at_version",
      v15Args,
    ).pipe(
      map((x) => {
        const metadataRaw = optionalOpaqueBytes.dec(x)!
        const metadata = metadataCodec.dec(metadataRaw)
        return { metadata: metadata.metadata.value as V15, metadataRaw }
      }),
    )

    return versions.pipe(
      catchError(() => of([14])),
      mergeMap((v) => (v.includes(15) ? v15 : v14)),
    )
  }

  return (hash: string): Runtime => {
    const usages = new Set<string>([hash])

    const runtimeContext$: Observable<RuntimeContext> = getMetadata$(hash).pipe(
      map(({ metadata, metadataRaw }) => {
        const lookup = getLookupFn(metadata)
        const dynamicBuilder = getDynamicBuilder(lookup)
        const events = dynamicBuilder.buildStorage("System", "Events")

        const assetPayment = metadata.extrinsic.signedExtensions.find(
          (x) => x.identifier === "ChargeAssetTxPayment",
        )

        let assetId: null | number = null
        if (assetPayment) {
          const assetTxPayment = lookup(assetPayment.type)
          if (assetTxPayment.type === "struct") {
            const optionalAssetId = assetTxPayment.value.asset_id
            if (optionalAssetId.type === "option")
              assetId = optionalAssetId.value.id
          }
        }

        return {
          assetId,
          metadataRaw,
          lookup,
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
    runtimeContext$.subscribe({
      error() {},
    })

    return result
  }
}
