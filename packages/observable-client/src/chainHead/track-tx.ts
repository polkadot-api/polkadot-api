import { HexString, ResultPayload } from "@polkadot-api/substrate-bindings"
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
  startWith,
  take,
  takeUntil,
  takeWhile,
} from "rxjs"
import { BlockInfo } from "./chainHead"
import { PinnedBlocks, SystemEvent } from "./streams"

export type AnalyzedBlock = {
  hash: HexString
  found:
    | {
        type: true
        index: number
        events: SystemEvent[]
      }
    | {
        type: false
        // null means that it's unknown: either the block was already present
        // when the tx was broadcasted, or it's still being analyzed.
        validity: ResultPayload<any, any> | null
      }
}

export const getTrackTx = (
  blocks$: Observable<PinnedBlocks> & { state: PinnedBlocks },
  newBlocks$: Observable<BlockInfo>,
  getBody: (block: string) => Observable<Uint8Array[]>, // Returns an observable that should emit just once and complete
  getIsValid: (
    block: string,
    tx: Uint8Array,
  ) => Observable<ResultPayload<any, any>>, // Returns an observable that should emit just once and complete
  getEvents: (block: string) => Observable<SystemEvent[]>, // Returns an observable that should emit just once and complete
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
    tx: Uint8Array,
    alreadyPresent: boolean,
  ): Observable<AnalyzedBlock> => {
    if (alreadyPresent)
      return of({ hash, found: { type: false, validity: null } })

    const whilePresent = whileBlockActive(hash)
    return getBody(hash).pipe(
      mergeMap((txs) => {
        const index = txs.findIndex((t) => u8eq(t, tx))
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

  /**
   * Whether the transaction might still make it through a branch other than the
   * one of `hash`: there's a block that's neither finalized nor pruned,
   * outside of the lineage of `hash`, where the transaction was either found,
   * valid, or not known to be invalid (blocks that were already present when we
   * started tracking).
   */
  const hasAlternativeBranch = (
    hash: HexString,
    results: Map<HexString, AnalyzedBlock>,
  ): boolean => {
    const { blocks, finalized } = blocks$.state
    const finalizedNumber = blocks.get(finalized)?.number ?? Infinity

    const lineage = new Set<HexString>()
    let ancestor = blocks.get(hash)
    while (ancestor && ancestor.number > finalizedNumber) {
      lineage.add(ancestor.hash)
      ancestor = blocks.get(ancestor.parent)
    }
    const addDescendants = (parent: HexString) =>
      blocks.get(parent)?.children.forEach((child) => {
        lineage.add(child)
        addDescendants(child)
      })
    addDescendants(hash)

    for (const block of blocks.values()) {
      if (
        block.pruned ||
        block.number <= finalizedNumber ||
        lineage.has(block.hash)
      )
        continue
      const found = results.get(block.hash)?.found
      if (found && (found.type || found.validity?.success !== false))
        return true
    }
    return false
  }

  const findInBranch = (
    hash: HexString,
    tx: Uint8Array,
    alreadyPresent: Set<HexString>,
    results: Map<HexString, AnalyzedBlock>,
  ): Observable<AnalyzedBlock> =>
    analyzeBlock(hash, tx, alreadyPresent.has(hash)).pipe(
      mergeMap((analyzed) => {
        results.set(hash, analyzed)
        const { found } = analyzed
        const isInvalid = !found.type && found.validity?.success === false

        // A transaction that's invalid in a block can become valid in one of
        // its descendants (e.g. a later block funds the account that pays the
        // fees). That will only happen if it's valid in some other branch, as
        // otherwise it gets dropped from the transaction pools. So we keep
        // looking in this branch only while there's a competing branch that
        // keeps the transaction alive.
        const isSettled =
          found.type || (isInvalid && !hasAlternativeBranch(hash, results))
        if (isSettled) {
          releaseDescendants(hash)
          return of(analyzed)
        }

        return blocks$.pipe(
          whileBlockActive(hash),
          isInvalid
            ? takeWhile(() => hasAlternativeBranch(hash, results))
            : (x) => x,
          mergeMap((x) => x.blocks.get(hash)!.children),
          distinct(),
          mergeMap((child) => {
            const child$ = findInBranch(child, tx, alreadyPresent, results)
            // Flag the child as being analyzed, so that the verdict of its
            // invalid parent is not taken as the one of this branch meanwhile.
            return isInvalid
              ? child$.pipe(
                  startWith<AnalyzedBlock>({
                    hash: child,
                    found: { type: false, validity: null },
                  }),
                )
              : child$
          }),
          startWith(analyzed),
        )
      }),
    )

  return (tx: Uint8Array): Observable<AnalyzedBlock> =>
    merge(
      hodl$,
      blocks$.pipe(
        take(1),
        mergeMap((x) =>
          findInBranch(x.finalized, tx, new Set(x.blocks.keys()), new Map()),
        ),
      ),
    )
}

const u8eq = (a: Uint8Array, b: Uint8Array) =>
  a.length === b.length && a.every((v, i) => b[i] === v)
