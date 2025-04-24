import { mergeMap, Observable, scan, share } from "rxjs"
import { BlockInfo } from "./chainHead"
import { PinnedBlocks } from "./streams"

export const getNewBlocks$ = (pinnedBlocks$: Observable<PinnedBlocks>) =>
  pinnedBlocks$.pipe(
    scan(
      ({ reportedBlocks: prevReportedBlocks }, { blocks }) => {
        const reportedBlocks = new Set<string>(blocks.keys())
        const newBlocks: BlockInfo[] = []

        if (reportedBlocks.size > prevReportedBlocks.size) {
          blocks.forEach(({ hash, number, parent }) => {
            if (!prevReportedBlocks.has(hash)) {
              newBlocks.push({
                hash,
                number,
                parent,
              })
            }
          })
        }

        return { reportedBlocks, newBlocks }
      },
      {
        reportedBlocks: new Set<string>(),
        newBlocks: new Array<BlockInfo>(0),
      },
    ),
    mergeMap(({ newBlocks }) => newBlocks),
    share(),
  )
