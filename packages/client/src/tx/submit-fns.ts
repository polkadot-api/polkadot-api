import {
  Binary,
  Blake2256,
  HexString,
  ResultPayload,
} from "@polkadot-api/substrate-bindings"
import {
  EMPTY,
  Observable,
  catchError,
  concat,
  distinctUntilChanged,
  filter,
  lastValueFrom,
  map,
  merge,
  mergeMap,
  of,
  reduce,
  take,
  takeWhile,
} from "rxjs"
import {
  ChainHead$,
  PinnedBlocks,
  SystemEvent,
} from "@polkadot-api/observable-client"
import { AnalyzedBlock } from "@polkadot-api/observable-client"
import { TxEvent, TxEventsPayload, TxFinalizedPayload } from "./types"
import { continueWith } from "@/utils"
import { fromHex, toHex } from "@polkadot-api/utils"

// TODO: make it dynamic based on the tx-function of the client
const hashFromTx = (tx: HexString) => toHex(Blake2256(fromHex(tx)))

const computeState = (
  analized$: Observable<AnalyzedBlock>,
  blocks$: Observable<PinnedBlocks>,
) =>
  new Observable<
    | {
        found: true
        hash: string
        number: number
        index: number
        events: any
      }
    | { found: false; validity: ResultPayload<any, any> | null }
  >((observer) => {
    const analyzedBlocks = new Map<string, AnalyzedBlock>()
    let pinnedBlocks: PinnedBlocks
    let latestState:
      | {
          found: true
          hash: string
          number: number
          index: number
          events: any
        }
      | { found: false; validity: ResultPayload<any, any> | null }

    const computeNextState = () => {
      let current: string = pinnedBlocks.best
      let analyzed: AnalyzedBlock | undefined = analyzedBlocks.get(current)
      let analyzedNumber = pinnedBlocks.blocks.get(current)!.number

      while (!analyzed) {
        const block = pinnedBlocks.blocks.get(current)
        if (!block) break
        analyzed = analyzedBlocks.get((current = block.parent))
        analyzedNumber--
      }

      if (!analyzed) return // this shouldn't happen, though

      const isFinalized =
        analyzedNumber <=
        pinnedBlocks.blocks.get(pinnedBlocks.finalized)!.number

      const found = analyzed.found.type
      if (found && latestState?.found && latestState.hash === analyzed.hash) {
        if (isFinalized) observer.complete()
        return
      }

      observer.next(
        (latestState = analyzed.found.type
          ? {
              found: found as true,
              hash: analyzed.hash,
              number: analyzedNumber,
              index: analyzed.found.index,
              events: analyzed.found.events,
            }
          : {
              found: found as false,
              validity: analyzed.found.validity,
            }),
      )

      if (isFinalized) {
        if (found) observer.complete()
        else if (analyzed.found.validity?.success === false)
          observer.error(new InvalidTxError(analyzed.found.validity.value))
      }
    }

    const subscription = blocks$
      .pipe(
        distinctUntilChanged(
          (a, b) => a.finalized === b.finalized && a.best === b.best,
        ),
      )
      .subscribe({
        next: (pinned: PinnedBlocks) => {
          pinnedBlocks = pinned
          if (analyzedBlocks.size === 0) return
          computeNextState()
        },
        error(e) {
          observer.error(e)
        },
      })

    subscription.add(
      analized$.subscribe({
        next: (block) => {
          analyzedBlocks.set(block.hash, block)
          computeNextState()
        },
        error(e) {
          observer.error(e)
        },
      }),
    )

    return subscription
  }).pipe(distinctUntilChanged((a, b) => a === b))

const getTxSuccessFromSystemEvents = (
  systemEvents: Array<SystemEvent>,
  txIdx: number,
): Omit<TxEventsPayload, "block"> => {
  const events = systemEvents
    .filter((x) => x.phase.type === "ApplyExtrinsic" && x.phase.value === txIdx)
    .map((x) => ({ ...x.event, topics: x.topics }))

  const lastEvent = events[events.length - 1]
  if (
    lastEvent.type === "System" &&
    lastEvent.value.type === "ExtrinsicFailed"
  ) {
    return {
      ok: false,
      events,
      dispatchError: lastEvent.value.value.dispatch_error,
    }
  }

  return { ok: true, events }
}

/*
type TransactionValidityError = Enum<{
  Invalid: Enum<{
    Call: undefined
    Payment: undefined
    Future: undefined
    Stale: undefined
    BadProof: undefined
    AncientBirthBlock: undefined
    ExhaustsResources: undefined
    Custom: number
    BadMandatory: undefined
    MandatoryValidation: undefined
    BadSigner: undefined
  }>
  Unknown: Enum<{
    CannotLookup: undefined
    NoUnsignedValidator: undefined
    Custom: number
  }>
}>
*/

export class InvalidTxError extends Error {
  error: any // likely to be a `TransactionValidityError`
  constructor(e: any) {
    super(
      JSON.stringify(
        e,
        (_, value) => {
          if (typeof value === "bigint") return value.toString()
          return value instanceof Binary ? value.asHex() : value
        },
        2,
      ),
    )
    this.name = "InvalidTxError"
    this.error = e
  }
}

export const submit$ = (
  chainHead: ChainHead$,
  broadcastTx$: (tx: string) => Observable<never>,
  tx: HexString,
  emitSign = false,
): Observable<TxEvent> => {
  const txHash = hashFromTx(tx)
  const getTxEvent = <
    Type extends TxEvent["type"],
    Rest extends Omit<TxEvent & { type: Type }, "type" | "txHash">,
  >(
    type: Type,
    rest: Rest,
  ): TxEvent & { type: Type } =>
    ({
      type,
      txHash,
      ...rest,
    }) as any

  const validate$ = chainHead.pinnedBlocks$.pipe(
    take(1),
    mergeMap((blocks) => {
      let bestBlocks: string[] = []
      return blocks.finalizedRuntime.runtime.pipe(
        map((r) => r.getMortalityFromTx(tx)),
        catchError(() => of({ mortal: false as const })),
        map((x) => {
          const { best, finalized } = blocks

          // before we start doing async stuff, we must "take a picture"
          // of the current lineage of best-blocks
          let current = best
          while (current !== finalized) {
            bestBlocks.push(current)
            current = blocks.blocks.get(current)!.parent
          }
          bestBlocks.push(finalized)

          if (!x.mortal) return [finalized, best]

          const { phase, period } = x
          const bestBlock = blocks.blocks.get(best)!
          const topNumber = bestBlock.number
          const txBlockNumber =
            Math.floor((topNumber - phase) / period) * period + phase

          let result = [blocks.blocks.get(blocks.finalized)!]
          while (result.length && result[0].number < txBlockNumber) {
            result = result
              .flatMap((x) => [...x.children])
              .map((x) => blocks.blocks.get(x)!)
              .filter(Boolean)
          }
          return (result.length ? result : [bestBlock]).map((x) => x.hash)
        }),
        mergeMap((toCheck) =>
          merge(
            ...[...new Set(toCheck)].map((at) =>
              chainHead
                .validateTx$(at, tx)
                .pipe(map((result) => ({ at, result }))),
            ),
          ),
        ),
        takeWhile(({ result }) => !result.success, true),
        reduce(
          (acc, curr) => [...acc, curr],
          [] as { at: string; result: ResultPayload<any, any> }[],
        ),
        map((results) => {
          const badOnes = new Map(
            results
              .filter(({ result }) => !result.success)
              .map((x) => [x.at, x.result]),
          )
          if (badOnes.size < results.length) return null

          throw new InvalidTxError(
            badOnes.get(bestBlocks.find((x) => badOnes.has(x))!)!.value,
          )
        }),
        filter(Boolean),
      )
    }),
  )

  const track$ = new Observable<AnalyzedBlock>((observer) => {
    const subscription = chainHead.trackTx$(tx).subscribe(observer)
    subscription.add(
      broadcastTx$(tx).subscribe({
        error(e) {
          observer.error(e)
        },
      }),
    )
    return subscription
  })

  const bestBlockState$ = computeState(track$, chainHead.pinnedBlocks$).pipe(
    map((x) => {
      if (!x.found)
        return getTxEvent("txBestBlocksState", {
          found: false,
          isValid: x.validity?.success !== false,
        })

      return getTxEvent("txBestBlocksState", {
        found: true,
        block: {
          index: x.index,
          number: x.number,
          hash: x.hash,
        },
        ...getTxSuccessFromSystemEvents(x.events, x.index),
      })
    }),
  )

  return concat(
    emitSign ? of(getTxEvent("signed", {})) : EMPTY,
    validate$,
    of(getTxEvent("broadcasted", {})),
    bestBlockState$.pipe(
      continueWith(({ found, type, ...rest }) =>
        found ? of(getTxEvent("finalized", rest as any)) : EMPTY,
      ),
    ),
  )
}

export const submit = async (
  chainHead: ChainHead$,
  broadcastTx$: (tx: string) => Observable<never>,
  transaction: HexString,
  _at?: HexString,
): Promise<TxFinalizedPayload> =>
  lastValueFrom(submit$(chainHead, broadcastTx$, transaction)).then((x) => {
    if (x.type !== "finalized") throw null
    const result: TxFinalizedPayload = { ...x }
    delete (result as any).type
    return result
  })
