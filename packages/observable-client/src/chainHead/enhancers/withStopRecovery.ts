import {
  concat,
  distinctUntilChanged,
  endWith,
  ignoreElements,
  map,
  NEVER,
  Observable,
  switchMap,
  takeWhile,
  throwError,
} from "rxjs"
import { PinnedBlocks, PinnedBlockState } from "../streams/pinned-blocks-types"
import { BlockNotPinnedError } from "../errors"
import { BlockInfo } from "../chainHead"

export function withStopRecovery<A extends Array<any>, T>(
  pinned$: Observable<PinnedBlocks> & { state: PinnedBlocks },
  fn: (hash: string, ...args: A) => Observable<T>,
  label: string,
) {
  return (hash: string, ...args: A) => {
    let block: BlockInfo | undefined
    const getNonPinnedError = () => new BlockNotPinnedError(hash, label)

    const inner$ = fn(hash, ...args).pipe(
      map((value) => ({ type: "val" as "val", value })),
      endWith({ type: "end" as "end" }),
    )

    const waitForIt$ = pinned$.pipe(
      takeWhile((x) => !x.blocks.has(hash)),
      map((x) => {
        if (x.blocks.get(x.finalized)!.number >= block!.number)
          throw getNonPinnedError()
      }),
      ignoreElements(),
    )

    return pinned$.pipe(
      map((x) => x.state.type === PinnedBlockState.Ready),
      distinctUntilChanged(),
      switchMap((isReady) => {
        if (!isReady) return NEVER
        block ||= pinned$.state.blocks.get(hash)
        return block
          ? concat(waitForIt$, inner$)
          : throwError(getNonPinnedError)
      }),
      takeWhile((x) => x.type === "val"),
      map((x) => x.value),
    )
  }
}
