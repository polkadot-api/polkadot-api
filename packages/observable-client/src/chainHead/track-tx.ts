import {
  Observable,
  concat,
  concatMap,
  distinct,
  filter,
  map,
  mergeMap,
  of,
  take,
  takeUntil,
  takeWhile,
} from "rxjs"
import { PinnedBlocks } from "./streams"
import { isBestOrFinalizedBlock, isFinalized } from "./streams/block-operations"

export type TrackedTx =
  | {
      type: "bestChainBlockIncluded"
      block: { hash: string; index: number }
    }
  | {
      type: "finalized"
      block: { hash: string; index: number }
    }

export const getTrackTx =
  (
    blocks$: Observable<PinnedBlocks>,
    getBody: (block: string) => Observable<string[]>,
  ) =>
  (tx: string): Observable<TrackedTx> =>
    blocks$.pipe(
      take(1),
      concatMap((x) => {
        const alreadyPresent = new Set(x.blocks.keys())

        const findInBody = (hash: string): Observable<number> =>
          alreadyPresent.has(hash)
            ? of(-1)
            : getBody(hash).pipe(
                takeUntil(
                  blocks$.pipe(filter(({ blocks }) => !blocks.has(hash))),
                ),
                map((txs) => txs.indexOf(tx)),
              )

        const findInBranch = (
          hash: string,
        ): Observable<{ hash: string; idx: number }> =>
          findInBody(hash).pipe(
            concatMap((idx) =>
              idx > -1
                ? of({ hash, idx })
                : blocks$.pipe(
                    takeWhile((x) => x.blocks.has(hash)),
                    mergeMap((x) => x.blocks.get(hash)!.children),
                    distinct(),
                    mergeMap(findInBranch),
                  ),
            ),
          )

        return findInBranch(x.finalized).pipe(
          mergeMap(({ hash, idx }) =>
            concat(
              blocks$.pipe(
                isBestOrFinalizedBlock(hash),
                filter(Boolean),
                take(1),
                map(() => ({
                  type: "bestChainBlockIncluded" as const,
                  block: { hash, index: idx },
                })),
              ),
              blocks$.pipe(
                isFinalized(hash),
                filter(Boolean),
                map(() => ({
                  type: "finalized" as const,
                  block: { hash, index: idx },
                })),
              ),
            ),
          ),
        )
      }),
      takeWhile((x) => x.type !== "finalized", true),
    )
