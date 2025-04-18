import { BlockInfo, PinnedBlocks } from "@polkadot-api/observable-client"
import { filter, map, mergeMap, Observable, scan, share } from "rxjs"
import { shareLatest } from "./utils"

export const getNewBlocks$ = (pinnedBlocks$: Observable<PinnedBlocks>) =>
  pinnedBlocks$.pipe(
    filter((pinnedBlocks) => !pinnedBlocks.recovering),
    scan(
      (acc, pinnedBlocks) => {
        const newReportedBlocks = new Set<string>()
        const newBlocks: BlockInfo[] = []

        pinnedBlocks.blocks.forEach(({ hash, number, parent, unpinned }) => {
          if (unpinned) return

          newReportedBlocks.add(hash)
          if (!acc.reportedBlocks.has(hash)) {
            newBlocks.push({
              hash,
              number,
              parent,
            })
          }
        })

        return { reportedBlocks: newReportedBlocks, newBlocks }
      },
      {
        reportedBlocks: new Set<string>(),
        newBlocks: new Array<BlockInfo>(0),
      },
    ),
    mergeMap(({ newBlocks }) => newBlocks),
    share(),
  )

export const getPinnedBlocks$ = (pinnedBlocks$: Observable<PinnedBlocks>) =>
  pinnedBlocks$.pipe(
    filter((pinnedBlocks) => !pinnedBlocks.recovering),
    map((pinnedBlocks) =>
      Object.fromEntries(
        [...pinnedBlocks.blocks.entries()]
          .filter(([, { unpinned }]) => !unpinned)
          .map(([key, { hash, number, parent }]) => [
            key,
            { hash, number, parent },
          ]),
      ),
    ),
    shareLatest,
  )
