import { AbortablePromiseFn, UnsubscribeFn } from "../common-types"

// Common
export interface Inaccessible {
  event: "inaccessible"
}

export interface Disjoint {
  event: "disjoint"
}

export interface FError {
  event: "error"
  error: string
}

export interface Done {
  event: "done"
}

// Follow
export interface Runtime {
  specName: string
  implName: string
  specVersion: number
  implVersion: number
  transactionVersion: number
  apis: Record<string, number>
}

export interface Initialized {
  event: "initialized"
  finalizedBlockHash: string
}

export type InitializedWithRuntime = Initialized & {
  finalizedBlockRuntime: Runtime
}

export interface NewBlock {
  event: "newBlock"
  blockHash: string
  parentBlockHash: string
}

export type NewBlockWithRuntime = NewBlock & {
  newRuntime: Runtime | null
}

export interface BestBlockChanged {
  event: "bestBlockChanged"
  bestBlockHash: string
}

export interface Finalized {
  event: "finalized"
  finalizedBlockHashes: Array<string>
  prunedBlockHashes: Array<string>
}

export interface Stop {
  event: "stop"
}

type CommonFollowEvents = BestBlockChanged | Finalized | Stop

// operation events
interface OperationEvent {
  operationId: string
}

export type OperationBodyDone = OperationEvent & {
  event: "operationBodyDone"
  value: Array<string>
}

export type OperationCallDone = OperationEvent & {
  event: "operationCallDone"
  output: string
}

export interface StorageItemResponse {
  key: string
  value?: string
  hash?: string
  "closest-descendant-merkle-value"?: string
}

export type OperationStorageItems = OperationEvent & {
  event: "operationStorageItems"
  items: Array<StorageItemResponse>
}

export type OperationWaitingForContinue = OperationEvent & {
  event: "operationWaitingForContinue"
}

export type OperationStorageDone = OperationEvent & {
  event: "operationStorageDone"
}

export type OperationInaccessible = OperationEvent & {
  event: "operationInaccessible"
}

export type OperationError = OperationEvent & {
  event: "operationError"
  error: string
}

export type CommonOperationEvents = OperationInaccessible | OperationError

export type OperationEvents =
  | OperationBodyDone
  | OperationCallDone
  | OperationStorageItems
  | OperationWaitingForContinue
  | OperationStorageDone
  | CommonOperationEvents

export type FollowEventWithRuntime =
  | InitializedWithRuntime
  | NewBlockWithRuntime
  | CommonFollowEvents
  | OperationEvents

export type FollowEventWithoutRuntime =
  | Initialized
  | NewBlock
  | CommonFollowEvents
  | OperationEvents

export interface StorageItemInput {
  key: string
  type:
    | "value"
    | "hash"
    | "closest-descendant-merkle-value"
    | "descendants-values"
    | "descendants-hashes"
}

export interface StorageResponse {
  values: Record<string, string>
  hashes: Record<string, string>
  closests: Record<string, string>
  descendantsValues: Record<string, Array<{ key: string; value: string }>>
  descendantsHashes: Record<string, Array<{ key: string; hash: string }>>
}

// Follow
export interface FollowResponse {
  unfollow: UnsubscribeFn
  body: AbortablePromiseFn<[hash: string], Array<string>>
  call: AbortablePromiseFn<
    [hash: string, fnName: string, callParameters: string],
    string
  >
  storage: AbortablePromiseFn<
    [
      hash: string,
      query: Partial<{
        value: Array<string>
        hash: Array<string>
        descendantsValues: Array<string>
        descendantsHashes: Array<string>
        closestDescendantMerkleValue: Array<string>
      }>,
      childTrie: string | null,
    ],
    StorageResponse
  >
  genesisHash: () => Promise<string>
  header: (hash: string) => Promise<string>
  unpin: (...hashes: Array<string>) => Promise<void>
}

// Operation Responses
export type OperationStarted = OperationEvent & {
  result: "started"
}
export interface LimitReached {
  result: "limitReached"
}
export type OperationResponse = OperationStarted | LimitReached
