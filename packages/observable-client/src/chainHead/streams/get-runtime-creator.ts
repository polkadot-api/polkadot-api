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
  Option,
  V15,
  u32,
  Encoder,
  _void,
  Bytes,
  metadata as metadataCodec,
  V14,
  Vector,
  Tuple,
  compact,
} from "@polkadot-api/substrate-bindings"
import { toHex } from "@polkadot-api/utils"
import {
  Observable,
  catchError,
  map,
  mergeMap,
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
  metadata: V15 | V14
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

const v15Args = toHex(u32.enc(15))
const opaqueMeta14 = Tuple(compact, Bytes())
const opaqueMeta15 = Option(Bytes())
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
        const [, metadataRaw] = opaqueMeta14.dec(x)!
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
        const metadataRaw = opaqueMeta15.dec(x)!
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
        const checksumBuilder = getChecksumBuilder(metadata)
        const dynamicBuilder = getDynamicBuilder(metadata)
        const events = dynamicBuilder.buildStorage("System", "Events")

        const assetPayment = metadata.extrinsic.signedExtensions.find(
          (x) => x.identifier === "ChargeAssetTxPayment",
        )

        let _assetId: null | number = null
        if (assetPayment) {
          const assetTxPayment = getLookupFn(metadata.lookup)(assetPayment.type)
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
          metadataRaw,
          metadata,
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
}
