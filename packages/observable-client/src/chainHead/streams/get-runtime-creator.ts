import {
  getDynamicBuilder,
  getLookupFn,
  MetadataLookup,
} from "@polkadot-api/metadata-builders"
import {
  AccountId,
  Binary,
  Bytes,
  Codec,
  Decoder,
  metadata as metadataCodec,
  Option,
  SS58String,
  u32,
  UnifiedMetadata,
  unifyMetadata,
  Vector,
} from "@polkadot-api/substrate-bindings"
import { toHex } from "@polkadot-api/utils"
import {
  catchError,
  EMPTY,
  map,
  mergeMap,
  Observable,
  of,
  shareReplay,
  timer,
} from "rxjs"
import { BlockNotPinnedError } from "../errors"
import { OperationInaccessibleError } from "@polkadot-api/substrate-client"

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
  topics: Array<Binary>
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

const versionedArgs = (v: number) => toHex(u32.enc(v))
const opaqueBytes = Bytes()
const optionalOpaqueBytes = Option(opaqueBytes)
const u32ListDecoder = Vector(u32).dec

export const getRuntimeCreator = (
  call$: (hash: string, method: string, args: string) => Observable<string>,
) => {
  const getMetadata$ = (
    getHash: () => string | null,
  ): Observable<{ metadataRaw: Uint8Array; metadata: UnifiedMetadata }> => {
    const recoverCall$ = (method: string, args: string): Observable<string> => {
      const hash = getHash()
      return hash
        ? call$(hash, method, args).pipe(
            catchError((e) => {
              if (e instanceof BlockNotPinnedError)
                return recoverCall$(method, args)
              if (e instanceof OperationInaccessibleError)
                return timer(750).pipe(
                  mergeMap(() => recoverCall$(method, args)),
                )
              throw e
            }),
          )
        : EMPTY
    }

    const versions = recoverCall$("Metadata_metadata_versions", "").pipe(
      map(u32ListDecoder),
    )

    const v14 = recoverCall$("Metadata_metadata", "").pipe(
      map((x) => {
        const metadataRaw = opaqueBytes.dec(x)!
        const metadata = metadataCodec.dec(metadataRaw)
        return { metadata: unifyMetadata(metadata), metadataRaw }
      }),
    )

    const versioned = (v: number) =>
      recoverCall$("Metadata_metadata_at_version", versionedArgs(v)).pipe(
        map((x) => {
          const metadataRaw = optionalOpaqueBytes.dec(x)!
          const metadata = metadataCodec.dec(metadataRaw)
          return { metadata: unifyMetadata(metadata), metadataRaw }
        }),
      )

    return versions.pipe(
      catchError(() => of([14])),
      mergeMap((v) =>
        v.includes(16) ? versioned(16) : v.includes(15) ? versioned(15) : v14,
      ),
    )
  }

  return (getHash: () => string | null): Runtime => {
    const initialHash = getHash()!
    const usages = new Set<string>([initialHash])

    const runtimeContext$: Observable<RuntimeContext> = getMetadata$(
      getHash,
    ).pipe(
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
            key: events.keys.enc(),
            dec: events.value.dec as any,
          },
          accountId: AccountId(dynamicBuilder.ss58Prefix),
        }
      }),
      shareReplay(1),
    )

    const result: Runtime = {
      at: initialHash,
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
