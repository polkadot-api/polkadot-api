import { FollowEventWithRuntime, Runtime } from "@polkadot-api/substrate-client"
import { Observable, distinctUntilChanged, map, scan } from "rxjs"

export const getRuntime$ = (follow$: Observable<FollowEventWithRuntime>) =>
  follow$.pipe(
    scan(
      (acc, event) => {
        if (event.type === "initialized") {
          acc.candidates.clear()
          acc.current = event.finalizedBlockRuntime
        }

        if (event.type === "newBlock" && event.newRuntime)
          acc.candidates.set(event.blockHash, event.newRuntime)

        if (event.type !== "finalized") return acc

        const [newRuntimeHash] = event.finalizedBlockHashes
          .filter((h) => acc.candidates.has(h))
          .slice(-1)
        if (newRuntimeHash) acc.current = acc.candidates.get(newRuntimeHash)!

        acc.candidates.clear()
        return acc
      },
      {
        candidates: new Map<string, Runtime>(),
        current: {} as Runtime,
      },
    ),
    map((x) => x.current),
    distinctUntilChanged(),
  )
