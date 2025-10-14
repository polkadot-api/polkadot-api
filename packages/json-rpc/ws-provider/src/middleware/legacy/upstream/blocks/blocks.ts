import {
  concat,
  concatMap,
  debounceTime,
  defer,
  filter,
  map,
  merge,
  mergeMap,
  Observable,
  of,
  share,
  Subject,
  take,
  takeWhile,
  tap,
} from "rxjs"
import { HexString } from "@polkadot-api/substrate-bindings"
import type {
  BestBlockChangedEvent,
  DecentHeader,
  InitializedEvent,
  NewBlockEvent,
} from "../../types"
import { UpstreamEvents } from "./upstream-events"
import { shareLatest } from "../../utils/share-latest"

export const getBlocks = ({
  allHeads$,
  finalized$: finalizedWire$,
  getHeader$,
  hasher$,
  getRecursiveHeader,
}: UpstreamEvents) => {
  const connectedBlocks = {
    blocks: new Map<
      string,
      DecentHeader & {
        children: Set<string>
        usages: Set<string>
      }
    >(),
    prevFin: "",
    finalized: "",
    best: "",
  }

  const getTree = (root: string, result: string[] = []): string[] => {
    result.push(root)
    connectedBlocks.blocks.get(root)!.children.forEach((c) => {
      getTree(c, result)
    })
    return result
  }

  const addBlock = (block: DecentHeader) => {
    const { blocks } = connectedBlocks
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

  const setBestFromFinalized = () => {
    connectedBlocks.best = connectedBlocks.finalized
    let bestHeight = 0
    const { finalized, blocks } = connectedBlocks
    getTree(finalized)
      .map((x) => blocks.get(x)!)
      .forEach((x) => {
        if (x.number > bestHeight) {
          bestHeight = x.number
          connectedBlocks.best = x.hash
        }
      })
  }

  const pendingBlocks = new Map<
    string,
    {
      hash: string
      header: DecentHeader | null
      children: Set<string>
    }
  >()

  const trimPending = (root: string) => {
    const desc = [...pendingBlocks.get(root)!.children]
    pendingBlocks.delete(root)
    desc.forEach(trimPending)
  }

  const getPendingTree = (
    root: string,
    result: Array<DecentHeader> = [],
  ): Array<DecentHeader> => {
    const me = pendingBlocks.get(root)!
    if (!me.header) return result
    result.push(me.header)
    me!.children.forEach((c) => {
      getPendingTree(c, result)
    })
    return result
  }

  const _newBlocks$ = new Subject<string>()
  const onError = (e: any) => _newBlocks$.error(e)

  const _finalized$ = finalizedWire$.pipe(
    concatMap((header, idx) => {
      const { hash } = header
      if (!idx) {
        addBlock(header)
        connectedBlocks.finalized = connectedBlocks.best = header.hash
      }
      return connectedBlocks.blocks.has(hash)
        ? of(hash)
        : _newBlocks$.pipe(
            filter((x) => x === hash),
            // some of the following blocks could be prunned b/c of this finalized event.
            // So, we have to make sure that this "batch" of _newBlocks has been flushed.
            debounceTime(0),
            take(1),
          )
    }),
    share(),
  )

  allHeads$.subscribe((header) => {
    const { parent, hash, number } = header
    if (connectedBlocks.blocks.has(hash) || !number) return

    if (connectedBlocks.blocks.has(parent)) {
      addBlock(header)
      _newBlocks$.next(hash)
    } else {
      pendingBlocks.set(hash, {
        hash: header.hash,
        header,
        children: new Set<string>(),
      })

      if (!pendingBlocks.has(parent)) {
        pendingBlocks.set(parent, {
          hash: parent,
          header: null,
          children: new Set(),
        })

        getRecursiveHeader(parent)
          .pipe(
            takeWhile((result) => {
              let me = pendingBlocks.get(result.hash)
              if (!me) return false // it was trimmed before b/c it was a prunned branch
              me.header = result

              const finalized = connectedBlocks.blocks.get(
                connectedBlocks.finalized,
              )

              // let's check if we have to prune this
              if (finalized && result.number <= finalized.number) {
                while (pendingBlocks.has(me.header?.parent ?? ""))
                  me = pendingBlocks.get(me.header!.parent)!
                trimPending(me.hash)
                return false
              }

              if (connectedBlocks.blocks.has(result.parent)) {
                let target = connectedBlocks.blocks.get(result.parent)!
                const diff = target.number - finalized!.number
                for (let i = 0; i < diff; i++) {
                  const nextTarget = connectedBlocks.blocks.get(target.parent)
                  if (!nextTarget) break
                  target = nextTarget
                }

                // it descends from the finalized block, all good...
                if (target === finalized) {
                  const pendingOnes = getPendingTree(result.hash)
                  pendingOnes.forEach((h) => {
                    pendingBlocks.delete(h.hash)
                    addBlock(h)
                    _newBlocks$.next(h.hash)
                  })
                } else trimPending(result.hash) // it was a pruned branch

                return false
              }

              const pendingParent = pendingBlocks.get(result.parent)
              // another subscription is loading it already
              if (pendingParent) {
                pendingParent.children.add(result.hash)
                return false
              }

              pendingBlocks.set(result.parent, {
                hash: result.parent,
                header: null,
                children: new Set([result.hash]),
              })
              return true
            }),
          )
          .subscribe({ error: onError })
      }
      pendingBlocks.get(parent)!.children.add(hash)
    }
  }, onError)

  const getFinalizedEvent = (): {
    event: "finalized"
    prunedBlockHashes: string[]
    finalizedBlockHashes: string[]
  } => {
    const prunedBlockHashes: string[] = []
    const finalizedBlockHashes: string[] = []
    const { blocks, finalized, prevFin } = connectedBlocks

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

  let activeSubscriptions = new Set<string>()
  const getNewBlockEvent = (blockHash: string) => {
    const block = connectedBlocks.blocks.get(blockHash)!
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
    const { blocks } = connectedBlocks
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
    _newBlocks$.pipe(
      map((hash) => ({
        type: "new" as const,
        value: connectedBlocks.blocks.get(hash)!,
      })),
    ),
    _finalized$.pipe(map((hash) => ({ type: "fin" as const, value: hash }))),
  ).pipe(
    mergeMap((x) => {
      if (x.type === "new") {
        const block = x.value
        const { hash } = block
        addBlock(block)
        const result: Array<
          | ReturnType<typeof getNewBlockEvent>
          | { event: "bestBlockChanged"; bestBlockHash: string }
        > = [getNewBlockEvent(hash)]
        if (
          block.number >
          connectedBlocks.blocks.get(connectedBlocks.best)!.number
        ) {
          connectedBlocks.best = hash
          result.push({ event: "bestBlockChanged", bestBlockHash: hash })
        }
        return result
      }

      connectedBlocks.prevFin = connectedBlocks.finalized
      connectedBlocks.finalized = x.value
      let prevBest = connectedBlocks.best
      setBestFromFinalized()
      const result: Array<
        | ReturnType<typeof getFinalizedEvent>
        | { event: "bestBlockChanged"; bestBlockHash: string }
      > = [getFinalizedEvent()]

      if (prevBest !== connectedBlocks.best)
        result.unshift({
          event: "bestBlockChanged",
          bestBlockHash: connectedBlocks.best,
        })
      return result
    }),
    share(),
  )

  const ready$ = defer(() =>
    connectedBlocks.blocks.size
      ? [null]
      : _finalized$.pipe(
          take(1),
          map(() => null),
        ),
  ).pipe(shareLatest)

  const finalized$ = _finalized$.pipe(
    map((hash) => connectedBlocks.blocks.get(hash)! as DecentHeader),
    shareLatest,
  )

  merge(updates$, finalized$).subscribe({
    error: onError,
  })

  const upstream = (subId: string) => {
    const getInitialized = () => {
      const { blocks, finalized } = connectedBlocks
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
      const block = connectedBlocks.blocks.get(blockHash)
      if (block) {
        block.usages.delete(subId)
        tryRemove(blockHash)
      }
    }

    const initialEvents$: Observable<
      InitializedEvent | NewBlockEvent | BestBlockChangedEvent
    > = ready$.pipe(
      mergeMap(() => {
        const { best, finalized } = connectedBlocks
        const others: Array<NewBlockEvent | BestBlockChangedEvent> = getTree(
          finalized,
        )
          .slice(1)
          .map(getNewBlockEvent)
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
      getHeader: (blockHash: string) =>
        connectedBlocks.blocks.get(blockHash)?.header ?? null,
      isPinned: (blockHash: string) =>
        !!connectedBlocks.blocks.get(blockHash)?.usages.has(subId),
      unpin,
    }
  }

  const clean = () => {
    pendingBlocks.clear()
    connectedBlocks.blocks.clear()
  }

  return {
    clean,
    upstream,
    finalized$,
    getHeader$: (hash: HexString): Observable<DecentHeader> => {
      const block = connectedBlocks.blocks.get(hash)
      return block ? of(block) : getHeader$(hash)
    },
    hasher$,
  }
}
