import {
  Binary,
  HexString,
  ResultPayload,
} from "@polkadot-api/substrate-bindings"
import {
  EMPTY,
  Observable,
  concat,
  defer,
  distinctUntilChanged,
  endWith,
  filter,
  ignoreElements,
  lastValueFrom,
  map,
  merge,
  mergeMap,
  of,
  race,
  take,
  takeWhile,
} from "rxjs"
import {
  BlockInfo,
  ChainHead$,
  PinnedBlocks,
  SystemEvent,
} from "@polkadot-api/observable-client"
import { AnalyzedBlock } from "@polkadot-api/observable-client"
import { TxEvent, TxEventsPayload, TxFinalizedPayload } from "./types"
import { continueWith } from "@/utils"
import { fromHex, toHex } from "@polkadot-api/utils"

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
        events: SystemEvent[]
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
          events: SystemEvent[]
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
    .map((x) => ({ ...x, ...x.event }))

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
  Uknown: Enum<{
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
): Observable<TxEvent> =>
  chainHead.hasher$.pipe(
    mergeMap((hasher) => {
      const txHash = toHex(hasher(fromHex(tx)))
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

      const pinnedBlocks = chainHead.pinnedBlocks$.state
      const getHeightFromMortality = (
        mortality:
          | {
              mortal: false
            }
          | {
              mortal: true
              period: number
              phase: number
            },
      ) => {
        if (!mortality.mortal) return 0
        const { phase, period } = mortality
        const topNumber = pinnedBlocks.blocks.get(pinnedBlocks.best)!.number
        return (
          Math.floor((Math.max(topNumber, phase) - phase) / period) * period +
          phase
        )
      }

      const getTipsFromHeight = (height: number): BlockInfo[] => {
        let tips: BlockInfo[] = [...pinnedBlocks.blocks.values()].filter(
          (block) => !block.pruned && !block.children.size,
        )
        const higherTip = Math.max(...tips.map(({ number }) => number))
        // take only tips "with chance to become canonical"
        tips = tips.filter(({ number }) => number >= higherTip - 1)

        const finalized = pinnedBlocks.blocks.get(pinnedBlocks.finalized)!
        tips = finalized.children ? [finalized, ...tips] : tips

        return tips.filter((x) => x.number >= height)
      }

      const validateTxAt$ = ({ hash }: BlockInfo) =>
        chainHead.validateTx$(hash, tx)
      const validate$: Observable<never> = defer(() =>
        pinnedBlocks.finalizedRuntime.runtime.pipe(
          map((r) => r.getMortalityFromTx(tx)),
          map(getHeightFromMortality),
          map(getTipsFromHeight),
          mergeMap((blocksToValidate) => {
            let err: InvalidTxError
            return merge(
              ...blocksToValidate.map((b) =>
                race(
                  validateTxAt$(b),
                  chainHead.finalized$.pipe(
                    takeWhile((finalized) => {
                      if (finalized.number < b.number) return true
                      let curr = finalized
                      while (curr.number > b.number) {
                        const parent = pinnedBlocks.blocks.get(curr.parent)
                        if (!parent) return false
                        curr = parent
                      }
                      return curr.hash === finalized.hash
                    }),
                    ignoreElements(),
                    endWith({ success: null }),
                  ),
                ),
              ),
            ).pipe(
              filter((v, idx) => {
                // save first error
                if (v.success === false) err ??= new InvalidTxError(v.value)

                if (v.success) return true
                if (idx === blocksToValidate.length - 1 && err) throw err
                return false
              }),
              take(1),
            )
          }),
          ignoreElements(),
        ),
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

      const bestBlockState$ = computeState(
        track$,
        chainHead.pinnedBlocks$,
      ).pipe(
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
    }),
  )

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
