import { BlockInfo, PinnedBlocks } from "@polkadot-api/observable-client"
import { filter, mergeMap, Observable, scan, share } from "rxjs"

export const getNewBlocks$ = (pinnedBlocks$: Observable<PinnedBlocks>) =>
  pinnedBlocks$.pipe(
    filter((pinnedBlocks) => !pinnedBlocks.recovering),
    scan(
      (acc, pinnedBlocks) => {
        const newReportedBlocks = new Set<string>()
        const newBlocks: BlockInfo[] = []

        pinnedBlocks.blocks.forEach(({ hash, number, parent }) => {
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
