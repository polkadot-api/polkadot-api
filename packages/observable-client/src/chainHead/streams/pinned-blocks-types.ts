import { Runtime } from "./get-runtime-creator"

export interface PinnedBlock {
  hash: string
  number: number
  parent: string
  children: Set<string>
  runtime: string
  pruned: boolean
  refCount: number
  recovering: boolean
  hasNewRuntime: boolean
}

export const enum PinnedBlockState {
  Initializing, // We are waiting to get ready on the "first" best-block event of the current or next chainHead follow subscription.
  Ready, // Downstream events can be derived only when the PinnedBlockState is in this state
  RecoveringInit, // There has been a stop-event and we are hopping that the first initialized event has an overlap with the previous blocks.
  RecoveringFin, // We were not able to fully recover from the stop-even after the initialize event (the most recent block on init was behind the previous finalized one). So, we are waiting for a finalized event to be able to recover
}

type RecoveringInitState = { type: PinnedBlockState.RecoveringInit }
type ReadyState = { type: PinnedBlockState.Ready }
type InitializingState = {
  type: PinnedBlockState.Initializing
  pendingBlocks: Array<PinnedBlock>
}
type RecoveringFinState = {
  type: PinnedBlockState.RecoveringFin
  target: number
  pendingBlocks: Array<PinnedBlock>
}

export type PinnedBlocks = {
  best: string
  finalized: string
  runtimes: Record<string, Runtime>
  blocks: Map<string, PinnedBlock>
  finalizedRuntime: Runtime
  state:
    | RecoveringInitState
    | RecoveringFinState
    | ReadyState
    | InitializingState
}
