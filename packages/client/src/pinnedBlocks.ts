import { BlockInfo, PinnedBlocks } from "@polkadot-api/observable-client"
import {
  distinctUntilChanged,
  map,
  mergeMap,
  Observable,
  scan,
  share,
} from "rxjs"
import { shareLatest } from "./utils"

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

export const getPinnedBlocks$ = (pinnedBlocks$: Observable<PinnedBlocks>) =>
  pinnedBlocks$.pipe(
    map(({ blocks }) => ({
      blocks,
      s: blocks.size,
    })),
    distinctUntilChanged((prev, curr) => prev.s == curr.s),
    map(({ blocks }) =>
      Object.fromEntries(
        [...blocks.entries()].map(([key, { hash, number, parent }]) => [
          key,
          { hash, number, parent },
        ]),
      ),
    ),
    shareLatest,
  )
