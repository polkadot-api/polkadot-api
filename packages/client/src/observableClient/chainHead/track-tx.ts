import {
  Observable,
  concat,
  concatMap,
  distinct,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  of,
  take,
  takeUntil,
  takeWhile,
} from "rxjs"
import { PinnedBlocks } from "./streams"
import {
  TxBestChainBlockIncluded,
  TxFinalized,
} from "@polkadot-api/substrate-client"

export const getTrackTx = (
  blocks$: Observable<PinnedBlocks>,
  getBody: (block: string) => Observable<string[]>,
) => {
  const findBestOrFinalized = (blockHash: string, type: "best" | "finalized") =>
    blocks$.pipe(
      takeWhile((b) => b.blocks.has(blockHash)),
      distinctUntilChanged((a, b) => a[type] === b[type]),
      filter(
        (x) => x.blocks.get(x[type])!.number >= x.blocks.get(blockHash)!.number,
      ),
      map((pinned) => {
        const { number } = pinned.blocks.get(blockHash)!
        let current = pinned.blocks.get(pinned[type])!
        while (current.number > number)
          current = pinned.blocks.get(current.parent)!
        return current.hash === blockHash
      }),
      filter(Boolean),
      take(1),
    )

  return (tx: string): Observable<TxBestChainBlockIncluded | TxFinalized> =>
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
              findBestOrFinalized(hash, "best").pipe(
                map(() => ({
                  type: "bestChainBlockIncluded" as const,
                  block: { hash, index: idx },
                })),
              ),
              findBestOrFinalized(hash, "finalized").pipe(
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
}
