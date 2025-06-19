import {
  getDynamicBuilder,
  MetadataLookup,
} from "@polkadot-api/metadata-builders"
import {
  Binary,
  Codec,
  Decoder,
  HexString,
  metadata as metadataCodec,
  SS58String,
  UnifiedMetadata,
  unifyMetadata,
} from "@polkadot-api/substrate-bindings"
import {
  catchError,
  EMPTY,
  map,
  mergeMap,
  Observable,
  of,
  shareReplay,
  tap,
  timer,
} from "rxjs"
import { BlockNotPinnedError } from "../errors"
import { OperationInaccessibleError } from "@polkadot-api/substrate-client"
import { createRuntimeCtx, getRawMetadata$ } from "@/utils"

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

export type Mortality =
  | {
      mortal: false
    }
  | { mortal: true; period: number; phase: number }

export interface RuntimeContext {
  metadataRaw: Uint8Array
  lookup: MetadataLookup
  codeHash: HexString
  dynamicBuilder: ReturnType<typeof getDynamicBuilder>
  events: {
    key: string
    dec: Decoder<Array<SystemEvent>>
  }
  accountId: Codec<SS58String>
  assetId: number | null
  getMortalityFromTx: Decoder<Mortality>
}

export interface Runtime {
  at: string
  codeHash$: Observable<string>
  runtime: Observable<RuntimeContext>
  addBlock: (block: string) => Runtime
  deleteBlocks: (blocks: string[]) => number
  usages: Set<string>
}

const withRecovery =
  (getHash: () => string | null) =>
  <Args extends Array<any>, T>(
    fn: (hash: string, ...args: Args) => Observable<T>,
  ): ((...args: Args) => Observable<T>) => {
    const result: (...args: Args) => Observable<T> = (...args) => {
      const hash = getHash()
      return hash
        ? fn(hash, ...args).pipe(
            catchError((e) => {
              if (e instanceof BlockNotPinnedError) return result(...args)
              if (e instanceof OperationInaccessibleError)
                return timer(750).pipe(mergeMap(() => result(...args)))
              throw e
            }),
          )
        : EMPTY
    }
    return result
  }

export const getRuntimeCreator = (
  call$: (hash: string, method: string, args: string) => Observable<string>,
  getCodeHash$: (blockHash: string) => Observable<string>,
  getCachedMetadata: (codeHash: string) => Observable<Uint8Array | null>,
  setCachedMetadata: (codeHash: string, metadataRaw: Uint8Array) => void,
) => {
  const getMetadata$ = (
    codeHash$: Observable<string>,
    rawMetadata$: Observable<Uint8Array>,
  ): Observable<{
    metadataRaw: Uint8Array
    metadata: UnifiedMetadata
    codeHash: string
  }> =>
    codeHash$.pipe(
      mergeMap((codeHash) =>
        getCachedMetadata(codeHash).pipe(
          catchError(() => of(null)),
          mergeMap((metadataRaw) =>
            metadataRaw
              ? of(metadataRaw)
              : rawMetadata$.pipe(
                  tap((raw) => {
                    setCachedMetadata(codeHash, raw)
                  }),
                ),
          ),
          map((metadataRaw) => ({
            codeHash,
            metadataRaw,
            metadata: unifyMetadata(metadataCodec.dec(metadataRaw)),
          })),
        ),
      ),
    )

  return (getHash: () => string | null): Runtime => {
    const enhancer = withRecovery(getHash)
    const initialHash = getHash()!
    const usages = new Set<string>([initialHash])
    const codeHash$ = enhancer(getCodeHash$)().pipe(shareReplay(1))

    const runtimeContext$: Observable<RuntimeContext> = getMetadata$(
      codeHash$,
      getRawMetadata$(enhancer(call$)),
    ).pipe(
      map(({ metadata, metadataRaw, codeHash }) =>
        createRuntimeCtx(metadata, metadataRaw, codeHash),
      ),
      shareReplay(1),
    )

    const result: Runtime = {
      at: initialHash,
      runtime: runtimeContext$,
      codeHash$,
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
