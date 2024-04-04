import {
  Observable,
  distinctUntilChanged,
  filter,
  map,
  take,
  takeWhile,
} from "rxjs"
import { PinnedBlocks } from "./pinned-blocks"

export const isFinalized =
  (blockHash: string) => (blocks$: Observable<PinnedBlocks>) =>
    blocks$.pipe(
      takeWhile((b) => b.blocks.has(blockHash)),
      distinctUntilChanged((a, b) => a.finalized === b.finalized),
      filter(
        (x) =>
          x.blocks.get(x.finalized)!.number >= x.blocks.get(blockHash)!.number,
      ),
      take(1),
      map((pinned) => {
        const { number } = pinned.blocks.get(blockHash)!
        let current = pinned.blocks.get(pinned.finalized)!
        while (current.number > number)
          current = pinned.blocks.get(current.parent)!
        return current.hash === blockHash
      }),
    )

export const isBestOrFinalizedBlock =
  (blockHash: string) => (blocks$: Observable<PinnedBlocks>) =>
    blocks$.pipe(
      takeWhile((b) => b.blocks.has(blockHash)),
      distinctUntilChanged((a, b) => a.best === b.best),
      filter(
        (x) => x.blocks.get(x.best)!.number >= x.blocks.get(blockHash)!.number,
      ),
      map((pinned) => {
        const { number } = pinned.blocks.get(blockHash)!
        let current = pinned.blocks.get(pinned.best)!
        let isFinalized = pinned.finalized === current.hash
        while (current.number > number) {
          current = pinned.blocks.get(current.parent)!
          isFinalized = isFinalized || pinned.finalized === current.hash
        }
        return { isBest: current.hash === blockHash, isFinalized }
      }),
      takeWhile(({ isFinalized }) => !isFinalized, true),
      map(({ isBest }) => isBest),
    )
