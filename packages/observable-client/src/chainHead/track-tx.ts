import {
  Observable,
  distinct,
  filter,
  map,
  mergeMap,
  of,
  take,
  takeUntil,
} from "rxjs"
import { PinnedBlocks } from "./streams"
import { HexString, ResultPayload } from "@polkadot-api/substrate-bindings"

export type AnalyzedBlock = {
  hash: HexString
  found:
    | {
        type: true
        index: number
        events: any
      }
    | {
        type: false
        validity: ResultPayload<any, any> | null // null means that the block was already present when the tx was broadcasted
      }
}

export const getTrackTx = (
  blocks$: Observable<PinnedBlocks> & { state: PinnedBlocks },
  getBody: (block: string) => Observable<string[]>, // Returns an observable that should emit just once and complete
  getIsValid: (
    block: string,
    tx: string,
  ) => Observable<ResultPayload<any, any>>, // Returns an observable that should emit just once and complete
  getEvents: (block: string) => Observable<any>, // Returns an observable that should emit just once and complete
) => {
  const whileBlockPresent = <TT>(
    hash: string,
  ): (<T = TT>(base: Observable<T>) => Observable<T>) =>
    takeUntil(blocks$.pipe(filter(({ blocks }) => !blocks.has(hash))))

  const analyzeBlock = (
    hash: string,
    tx: string,
    alreadyPresent: boolean,
  ): Observable<AnalyzedBlock> => {
    if (alreadyPresent)
      return of({ hash, found: { type: false, validity: null } })

    const whilePresent = whileBlockPresent(hash)
    return getBody(hash).pipe(
      mergeMap((txs) => {
        const index = txs.indexOf(tx)
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
    )
  }

  const findInBranch = (
    hash: string,
    tx: string,
    alreadyPresent: Set<string>,
  ): Observable<AnalyzedBlock> =>
    analyzeBlock(hash, tx, alreadyPresent.has(hash)).pipe(
      mergeMap((analyzed) => {
        const { found } = analyzed
        return found.type || found.validity?.success === false
          ? of(analyzed)
          : blocks$.pipe(
              whileBlockPresent(hash),
              mergeMap((x) => x.blocks.get(hash)!.children),
              distinct(),
              mergeMap((hash) => findInBranch(hash, tx, alreadyPresent)),
            )
      }),
    )

  return (tx: string): Observable<AnalyzedBlock> =>
    blocks$.pipe(
      take(1),
      mergeMap((x) => findInBranch(x.finalized, tx, new Set(x.blocks.keys()))),
    )
}
