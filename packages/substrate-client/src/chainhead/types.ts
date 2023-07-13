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

export type FollowEventWithRuntime =
  | InitializedWithRuntime
  | NewBlockWithRuntime
  | BestBlockChanged
  | Finalized
  | Stop

export type FollowEventWithoutRuntime =
  | Initialized
  | NewBlock
  | BestBlockChanged
  | Finalized
  | Stop

// Body

export type BodyDone = Done & {
  value: Array<string>
}

export type BodyEvent = BodyDone | Inaccessible | Disjoint

// Call

export type CallDone = Done & {
  output: string
}

export type CallEvent = CallDone | Inaccessible | FError | Disjoint

// Storage

export interface StorageItemResponse {
  key: string
  value?: string
  hash?: string
  "closest-descendant-merkle-value"?: string
}

export interface StorageItems {
  event: "items"
  items: Array<StorageItemResponse>
}

export interface StorageWaitingForContinue {
  event: "waiting-for-continue"
}

export type StorageEvent =
  | StorageItems
  | StorageWaitingForContinue
  | Done
  | Inaccessible
  | FError
  | Disjoint

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
