import { Observable, distinctUntilChanged, filter, map, takeWhile } from "rxjs"
import { PinnedBlocks } from "./pinned-blocks"

export const isBestOrFinalizedBlock =
  (blockHash: string) => (blocks$: Observable<PinnedBlocks>) =>
    blocks$.pipe(
      takeWhile((b) => b.blocks.has(blockHash)),
      distinctUntilChanged(
        (a, b) => a.finalized === b.finalized && a.best === b.best,
      ),
      filter(
        (x) => x.blocks.get(x.best)!.number >= x.blocks.get(blockHash)!.number,
      ),
      map((pinned): "best" | "finalized" | null => {
        const { number } = pinned.blocks.get(blockHash)!
        let current = pinned.blocks.get(pinned.best)!
        let isFinalized = pinned.finalized === current.hash
        while (current.number > number) {
          current = pinned.blocks.get(current.parent)!
          isFinalized = isFinalized || pinned.finalized === current.hash
        }
        if (isFinalized) return "finalized"
        return current.hash === blockHash ? "best" : null
      }),
      distinctUntilChanged(),
      takeWhile((x) => x !== "finalized", true),
    )
