import {
  BestBlockChangedEvent,
  DecentHeader,
  InitializedEvent,
  NewBlockEvent,
} from "@/types"
import { UpstreamEvents } from "./upstream-events"
import {
  concat,
  EMPTY,
  map,
  merge,
  mergeMap,
  Observable,
  share,
  shareReplay,
  tap,
  withLatestFrom,
} from "rxjs"

export const getBlocks = ({
  initial$,
  allHeads$,
  finalized$: finHeader$,
}: UpstreamEvents) => {
  const finalized$ = finHeader$.pipe(map((x) => x.hash))
  const blocks = new Map<
    string,
    DecentHeader & {
      children: Set<string>
      usages: Set<string>
    }
  >()
  let prevFin = ""
  let finalized = ""
  let best = ""
  let activeSubscriptions = new Set<string>()

  const getTree = (root: string, result: string[] = []): string[] => {
    result.push(root)
    blocks.get(root)!.children.forEach((c) => {
      getTree(c, result)
    })
    return result
  }

  const getFinalizedEvent = (): {
    event: "finalized"
    prunedBlockHashes: string[]
    finalizedBlockHashes: string[]
  } => {
    const prunedBlockHashes: string[] = []
    const finalizedBlockHashes: string[] = []

    let current = blocks.get(finalized)!
    let prev = blocks.get(current.parent)
    while (prev) {
      finalizedBlockHashes.push(current.hash)
      prev.children.forEach((c) => {
        if (c !== current.hash) getTree(c, prunedBlockHashes)
      })
      current = prev
      if (current.hash === prevFin) break
      prev = blocks.get(current.parent)
    }
    finalizedBlockHashes.reverse()

    return { event: "finalized", prunedBlockHashes, finalizedBlockHashes }
  }

  const setBestFromFinalized = () => {
    best = finalized
    let bestHeight = 0
    getTree(finalized)
      .map((x) => blocks.get(x)!)
      .forEach((x) => {
        if (x.number > bestHeight) {
          bestHeight = x.number
          best = x.hash
        }
      })
  }

  const addBlock = (block: DecentHeader) => {
    const { hash, parent } = block
    const me = {
      ...block,
      children: new Set<string>(),
      usages: new Set<string>(),
    }
    blocks.set(hash, me)
    blocks.get(parent)?.children.add(hash)
    return me
  }

  const ready$ = initial$.pipe(
    withLatestFrom(finalized$),
    map(([initial, fin]) => {
      initial.forEach(addBlock)
      finalized = fin
      setBestFromFinalized()
      return null
    }),
    shareReplay(1),
  )

  const getNewBlockEvent = (blockHash: string) => {
    const block = blocks.get(blockHash)!
    activeSubscriptions.forEach((subId) => {
      block.usages.add(subId)
    })
    return {
      event: "newBlock" as const,
      blockHash,
      parentBlockHash: block.parent,
      newRuntime: block.hasUpgrade
        ? ({} as {
            specName: string
            implName: string
            specVersion: number
            implVersion: number
            transactionVersion: number
            apis: Record<string, number>
          })
        : null,
    }
  }

  const tryRemove = (blockHash: string, up?: boolean) => {
    const block = blocks.get(blockHash)
    if (!block || block.usages.size > 0) return

    const { parent, children } = block
    if (up !== true) children.forEach((c) => tryRemove(c, false))
    if (up !== false) tryRemove(parent, true)
    if (!blocks.has(parent) || !block.children.size) {
      blocks.get(parent)?.children.delete(blockHash)
      blocks.delete(blockHash)
    }
  }

  const updates$ = merge(
    allHeads$.pipe(map((value) => ({ type: "new" as const, value }))),
    finalized$.pipe(map((value) => ({ type: "fin" as const, value }))),
  ).pipe(
    mergeMap((x) => {
      if (finalized === "") return EMPTY
      if (x.type === "new") {
        const block = x.value
        const { hash } = block
        addBlock(block)
        const result: Array<
          | ReturnType<typeof getNewBlockEvent>
          | { event: "bestBlockChanged"; bestBlockHash: string }
        > = [getNewBlockEvent(hash)]
        if (block.number > blocks.get(best)!.number) {
          best = hash
          result.push({ event: "bestBlockChanged", bestBlockHash: hash })
        }
        return result
      }

      prevFin = finalized
      finalized = x.value
      let prevBest = best
      setBestFromFinalized()
      const result: Array<
        | ReturnType<typeof getFinalizedEvent>
        | { event: "bestBlockChanged"; bestBlockHash: string }
      > = [getFinalizedEvent()]

      if (prevBest !== best)
        result.unshift({ event: "bestBlockChanged", bestBlockHash: best })
      return result
    }),
    share(),
  )

  const subscription = merge(ready$, updates$).subscribe()

  const result = (subId: string) => {
    const getInitialized = () => {
      const finalizedBlockHashes: string[] = []
      let current = blocks.get(finalized)
      while (current && finalizedBlockHashes.length < 10) {
        finalizedBlockHashes.push(current.hash)
        current.usages.add(subId)
        current = blocks.get(current.parent)
      }
      finalizedBlockHashes.reverse()

      return {
        event: "initialized" as const,
        finalizedBlockHashes,
      }
    }

    const unpin = (blockHash: string) => {
      const block = blocks.get(blockHash)
      if (block) {
        block.usages.delete(subId)
        tryRemove(blockHash)
      }
    }

    const initialEvents$: Observable<
      InitializedEvent | NewBlockEvent | BestBlockChangedEvent
    > = ready$.pipe(
      mergeMap(() => {
        const others: Array<NewBlockEvent | BestBlockChangedEvent> = getTree(
          finalized,
        )
          .slice(1)
          .map(getNewBlockEvent)
        if (others.length)
          others.push({
            event: "bestBlockChanged" as const,
            bestBlockHash: best,
          })
        return [getInitialized(), ...others]
      }),
    )

    return {
      blocks$: concat(initialEvents$, updates$).pipe(
        tap({
          subscribe: () => {
            activeSubscriptions.add(subId)
          },
          finalize: () => {
            activeSubscriptions.delete(subId)
          },
        }),
        share(),
      ),
      getHeader: (blockHash: string) => blocks.get(blockHash)?.header ?? null,
      isPinned: (blockHash: string) =>
        !!blocks.get(blockHash)?.usages.has(subId),
      unpin,
    }
  }

  result.stop = () => {
    subscription.unsubscribe()
  }
  result.finalized$ = finHeader$
  return result
}
