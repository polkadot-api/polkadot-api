import {
  Observable,
  distinct,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  merge,
  mergeMap,
  of,
  take,
  takeUntil,
} from "rxjs"
import { PinnedBlocks } from "./streams"
import { HexString, ResultPayload } from "@polkadot-api/substrate-bindings"
import { BlockInfo } from "./chainHead"

export type AnalyzedBlock = {
  hash: HexString
  found:
    | {
        type: true
        index: number
        events: any
      }
    | {
        type: false
        validity: ResultPayload<any, any> | null // null means that the block was already present when the tx was broadcasted
      }
}

export const getTrackTx = (
  blocks$: Observable<PinnedBlocks> & { state: PinnedBlocks },
  newBlocks$: Observable<BlockInfo>,
  getBody: (block: string) => Observable<string[]>, // Returns an observable that should emit just once and complete
  getIsValid: (
    block: string,
    tx: string,
  ) => Observable<ResultPayload<any, any>>, // Returns an observable that should emit just once and complete
  getEvents: (block: string) => Observable<any>, // Returns an observable that should emit just once and complete
  hodl: (block: string) => () => void,
) => {
  const heldBlocks = new Map<string, () => void>()
  const release = (hash: string) => {
    heldBlocks.get(hash)?.()
    heldBlocks.delete(hash)
  }

  const hodl$ = new Observable<never>((observer) => {
    // As new blocks arrive we keep them around
    const sub = newBlocks$.subscribe({
      next: ({ hash }) => {
        heldBlocks.set(hash, hodl(hash))
      },
      complete() {
        // If we haven't fully recovered from a stop event we must error
        observer.error(new Error("Tracking stopped"))
      },
    })

    // We make sure to release pruned blocks
    sub.add(
      blocks$
        .pipe(
          map((x) => x.finalized),
          distinctUntilChanged(),
        )
        .subscribe(() => {
          blocks$.state.blocks.forEach(({ pruned, hash }) => {
            if (pruned) release(hash)
          })
        }),
    )

    // and to release all remaining held-blocks at the end
    sub.add(() => [...heldBlocks.keys()].forEach(release))
    return sub
  })

  const whileBlockActive = <TT>(
    hash: string,
  ): (<T = TT>(base: Observable<T>) => Observable<T>) =>
    takeUntil(
      blocks$.pipe(filter(({ blocks }) => blocks.get(hash)?.pruned ?? true)),
    )

  const analyzeBlock = (
    hash: string,
    tx: string,
    alreadyPresent: boolean,
  ): Observable<AnalyzedBlock> => {
    if (alreadyPresent)
      return of({ hash, found: { type: false, validity: null } })

    const whilePresent = whileBlockActive(hash)
    return getBody(hash).pipe(
      mergeMap((txs) => {
        const index = txs.indexOf(tx)
        return index > -1
          ? whilePresent(getEvents(hash)).pipe(
              map((events) => ({
                hash,
                found: {
                  type: true as true,
                  index,
                  events,
                },
              })),
            )
          : getIsValid(hash, tx).pipe(
              map((validity) => ({
                hash,
                found: { type: false as false, validity },
              })),
            )
      }),
      whilePresent,
      finalize(() => release(hash)),
    )
  }

  const releaseDescendants = (hash: string) => {
    const children = blocks$.state.blocks.get(hash)?.children.keys() ?? []
    ;[...children].forEach(releaseDescendants)
    release(hash)
  }

  const findInBranch = (
    hash: string,
    tx: string,
    alreadyPresent: Set<string>,
  ): Observable<AnalyzedBlock> =>
    analyzeBlock(hash, tx, alreadyPresent.has(hash)).pipe(
      mergeMap((analyzed) => {
        const { found } = analyzed
        const isSettled = found.type || found.validity?.success === false
        if (isSettled) releaseDescendants(hash)
        return isSettled
          ? of(analyzed)
          : blocks$.pipe(
              whileBlockActive(hash),
              mergeMap((x) => x.blocks.get(hash)!.children),
              distinct(),
              mergeMap((hash) => findInBranch(hash, tx, alreadyPresent)),
            )
      }),
    )

  return (tx: string): Observable<AnalyzedBlock> =>
    merge(
      hodl$,
      blocks$.pipe(
        take(1),
        mergeMap((x) =>
          findInBranch(x.finalized, tx, new Set(x.blocks.keys())),
        ),
      ),
    )
}
