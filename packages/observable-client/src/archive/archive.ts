import { RuntimeContext } from "@/chainHead"
import { fromAbortControllerFn } from "@/chainHead/enhancers"
import { createRuntimeCtx, getRawMetadata$ } from "@/utils"
import {
  blockHeader,
  HexString,
  metadata as metadataCodec,
  unifyMetadata,
} from "@polkadot-api/substrate-bindings"
import {
  Archive,
  StorageItemInput,
  StorageItemResponse,
  StorageResult,
} from "@polkadot-api/substrate-client"
import { fromHex } from "@polkadot-api/utils"
import { catchError, map, mergeMap, Observable, of, tap } from "rxjs"

export const getArchive =
  ({ storageSubscription, ...archive }: Archive) =>
  (getRuntime: (codeHash: string) => Observable<RuntimeContext | null>) => {
    const runtimes: Record<string, RuntimeContext> = {}
    const rawStorage$ = fromAbortControllerFn(archive.storage)
    const call$ = (hash: string, fnName: string, callParameters: string) =>
      fromAbortControllerFn(archive.call)(hash, fnName, callParameters).pipe(
        map(fromHex),
      )
    const rawHeader$ = fromAbortControllerFn(archive.header)
    const body$ = (hash: string) =>
      fromAbortControllerFn(archive.body)(hash).pipe(map((v) => v.map(fromHex)))

    const header$ = (blockHash: string) =>
      rawHeader$(blockHash).pipe(map(blockHeader[1]))

    const getCodeHash = (blockHash: string): Observable<HexString> =>
      // ":code" => "0x3a636f6465"
      rawStorage$(blockHash, "hash", "0x3a636f6465", null).pipe(map((x) => x!))

    const getRuntime$ = (codeHash: string, blockHash: string) =>
      getRuntime(codeHash).pipe(
        catchError(() => of(null)),
        mergeMap((result) =>
          result
            ? of(result)
            : getRawMetadata$((...args) => call$(blockHash, ...args)).pipe(
                map((rawMetadata) =>
                  createRuntimeCtx(
                    unifyMetadata(metadataCodec.dec(rawMetadata)),
                    rawMetadata,
                    codeHash,
                  ),
                ),
              ),
        ),
        tap((runtime) => {
          runtimes[codeHash] = runtime
        }),
      )

    const getRuntimeContext$ = (blockHash: string) =>
      getCodeHash(blockHash).pipe(
        mergeMap((codeHash) => {
          const runtime = runtimes[codeHash]
          return runtime ? of(runtime) : getRuntime$(codeHash, blockHash)
        }),
      )

    const storage$ = <
      Type extends StorageItemInput["type"],
      M extends
        | undefined
        | ((data: StorageResult<Type>, ctx: RuntimeContext) => any),
    >(
      hash: string,
      type: Type,
      keyMapper: (ctx: RuntimeContext) => string,
      childTrie: string | null = null,
      mapper?: M,
    ): Observable<
      undefined extends M ? StorageResult<Type> : ReturnType<NonNullable<M>>
    > =>
      getRuntimeContext$(hash).pipe(
        mergeMap((ctx) =>
          rawStorage$(hash, type, keyMapper(ctx), childTrie).pipe(
            map((x) => (mapper ? mapper(x, ctx) : x)),
          ),
        ),
      )

    const storageQueries$ = (
      hash: string,
      queries: Array<StorageItemInput>,
      childTrie?: string,
    ): Observable<StorageItemResponse> =>
      new Observable((observer) =>
        storageSubscription(
          hash,
          queries,
          childTrie || null,
          (item) => observer.next(item),
          (error) => observer.error(error),
          () => {
            observer.complete()
          },
        ),
      )

    const eventsAt$ = (hash: string) =>
      storage$(
        hash,
        "value",
        (ctx) => ctx.events.key,
        null,
        (x, ctx) => ctx.events.dec(x!),
      )

    return {
      body$,
      header$,
      storage$,
      storageQueries$,
      call$,
      eventsAt$,
      getRuntimeContext$,
    }
  }

export type Archive$ = ReturnType<ReturnType<typeof getArchive>>
