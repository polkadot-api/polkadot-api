export interface RuntimeRpc {
  specName: string
  implName: string
  specVersion: number
  implVersion: number
  transactionVersion: number
  apis: Record<string, number>
}

export type InitializedRpc = {
  event: "initialized"
  finalizedBlockHashes: string[]
}

export type InitializedWithRuntime = InitializedRpc & {
  finalizedBlockRuntime: RuntimeRpc
}

export interface NewBlockRpc {
  event: "newBlock"
  blockHash: string
  parentBlockHash: string
}

export type NewBlockWithRuntime = NewBlockRpc & {
  newRuntime: RuntimeRpc | null
}

export interface BestBlockChangedRpc {
  event: "bestBlockChanged"
  bestBlockHash: string
}

export interface FinalizedRpc {
  event: "finalized"
  finalizedBlockHashes: Array<string>
  prunedBlockHashes: Array<string>
}

type CommonFollowEventsRpc = BestBlockChangedRpc | FinalizedRpc

export type FollowEventWithRuntimeRpc =
  | InitializedWithRuntime
  | NewBlockWithRuntime
  | CommonFollowEventsRpc

export type FollowEventWithoutRuntimeRpc =
  | InitializedRpc
  | NewBlockRpc
  | CommonFollowEventsRpc

// Common
export interface InaccessibleRpc {
  event: "inaccessible"
}

export interface DisjointRpc {
  event: "disjoint"
}

export interface FErrorRpc {
  event: "error"
  error: string
}

export interface StopRpc {
  event: "stop"
}

export interface DoneRpc {
  event: "done"
}

// operation events
interface OperationEventRpc {
  operationId: string
}

export type OperationWaitingForContinueRpc = OperationEventRpc & {
  event: "operationWaitingForContinue"
}

export type OperationInaccessibleRpc = OperationEventRpc & {
  event: "operationInaccessible"
}

export type OperationErrorRpc = OperationEventRpc & {
  event: "operationError"
  error: string
}

export type CommonOperationEventsRpc =
  | OperationInaccessibleRpc
  | OperationErrorRpc

export type OperationBodyDoneRpc = OperationEventRpc & {
  event: "operationBodyDone"
  value: Array<string>
}

export type OperationCallDoneRpc = OperationEventRpc & {
  event: "operationCallDone"
  output: string
}

export interface StorageItemResponseRpc {
  key: string
  value?: string
  hash?: string
  closestDescendantMerkleValue?: string
}

export type OperationStorageItemsRpc = OperationEventRpc & {
  event: "operationStorageItems"
  items: Array<StorageItemResponseRpc>
}

export type OperationStorageDoneRpc = OperationEventRpc & {
  event: "operationStorageDone"
}

export type OperationEventsRpc =
  | OperationBodyDoneRpc
  | OperationCallDoneRpc
  | OperationStorageItemsRpc
  | OperationWaitingForContinueRpc
  | OperationStorageDoneRpc
  | CommonOperationEventsRpc

export interface StorageItemInputRpc {
  key: string
  type:
    | "value"
    | "hash"
    | "closestDescendantMerkleValue"
    | "descendantsValues"
    | "descendantsHashes"
}

// Operation Responses
export type OperationStartedRpc = OperationEventRpc & {
  result: "started"
}
export type OperationStorageStartedRpc = OperationEventRpc & {
  result: "started"
  discardedItems: number
}
export interface LimitReachedRpc {
  result: "limitReached"
}
export type OperationResponseRpc = OperationStartedRpc | LimitReachedRpc
