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
  HexString,
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
  tap,
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
  codeHash: HexString
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
  codeHash$: Observable<string>
  runtime: Observable<RuntimeContext>
  addBlock: (block: string) => Runtime
  deleteBlocks: (blocks: string[]) => number
  usages: Set<string>
}

const versionedArgs = (v: number) => toHex(u32.enc(v))
const opaqueBytes = Bytes()
const optionalOpaqueBytes = Option(opaqueBytes)
const u32ListDecoder = Vector(u32).dec

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
    call$: (method: string, args: string) => Observable<string>,
  ): Observable<{
    metadataRaw: Uint8Array
    metadata: UnifiedMetadata
    codeHash: string
  }> => {
    const versions$ = call$("Metadata_metadata_versions", "").pipe(
      map(u32ListDecoder),
      catchError(() => of([14])),
    )
    const versioned$ = (availableVersions: number[]) => {
      const [v] = availableVersions
        .filter((x) => x > 13 && x < 17)
        .sort((a, b) => b - a)
      return v === 14
        ? call$("Metadata_metadata", "").pipe(map(opaqueBytes.dec))
        : call$("Metadata_metadata_at_version", versionedArgs(v)).pipe(
            map((x) => optionalOpaqueBytes.dec(x)!),
          )
    }
    const metadataRaw$ = versions$.pipe(mergeMap(versioned$))

    return codeHash$.pipe(
      mergeMap((codeHash) =>
        getCachedMetadata(codeHash).pipe(
          catchError(() => of(null)),
          mergeMap((metadataRaw) =>
            metadataRaw
              ? of(metadataRaw)
              : metadataRaw$.pipe(
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
  }

  return (getHash: () => string | null): Runtime => {
    const enhancer = withRecovery(getHash)
    const initialHash = getHash()!
    const usages = new Set<string>([initialHash])
    const codeHash$ = enhancer(getCodeHash$)().pipe(shareReplay(1))

    const runtimeContext$: Observable<RuntimeContext> = getMetadata$(
      codeHash$,
      enhancer(call$),
    ).pipe(
      map(({ metadata, metadataRaw, codeHash }) => {
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
          codeHash,
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
