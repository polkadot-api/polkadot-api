import type { FollowEventWithRuntime } from "@polkadot-api/substrate-client"
import type { Observable } from "rxjs"

import { mergeMap } from "rxjs"
import { shareLatest } from "@/utils"

export const getFinalized$ = (follow$: Observable<FollowEventWithRuntime>) =>
  follow$.pipe(
    mergeMap((e) => {
      if (e.type === "finalized") return e.finalizedBlockHashes
      if (e.type !== "initialized") return []
      return [e.finalizedBlockHash]
    }),
    shareLatest,
  )
