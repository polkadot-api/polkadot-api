import { ClientRequestCb } from "@/client"
import type { AbortablePromiseFn, UnsubscribeFn } from "@/common-types"
import { StorageItemInput, StorageItemResponse } from "./internal-types"

export type { StorageItemInput, StorageItemResponse } from "./internal-types"

export interface Runtime {
  specName: string
  implName: string
  specVersion: number
  implVersion: number
  transactionVersion: number
  apis: Record<string, number>
}

export interface Initialized {
  type: "initialized"
  finalizedBlockHash: string
}

export type InitializedWithRuntime = Initialized & {
  finalizedBlockRuntime: Runtime
}

export interface NewBlock {
  type: "newBlock"
  blockHash: string
  parentBlockHash: string
}

export type NewBlockWithRuntime = NewBlock & {
  newRuntime: Runtime | null
}

export interface BestBlockChanged {
  type: "bestBlockChanged"
  bestBlockHash: string
}

export interface Finalized {
  type: "finalized"
  finalizedBlockHashes: Array<string>
  prunedBlockHashes: Array<string>
}

type CommonFollowEvents = BestBlockChanged | Finalized

export type FollowEventWithRuntime =
  | InitializedWithRuntime
  | NewBlockWithRuntime
  | CommonFollowEvents

export type FollowEventWithoutRuntime =
  | Initialized
  | NewBlock
  | CommonFollowEvents

export interface StorageResponse {
  values: Record<string, string>
  hashes: Record<string, string>
  closests: Record<string, string>
  descendantsValues: Record<string, Array<{ key: string; value: string }>>
  descendantsHashes: Record<string, Array<{ key: string; hash: string }>>
}

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
  storageSubscription: (
    hash: string,
    inputs: Array<StorageItemInput>,
    childTrie: string | null,
    onItems: (items: Array<StorageItemResponse>) => void,
    onError: (e: Error) => void,
    onDone: () => void,
    onDiscartedItems: (nDiscarted: number) => void,
  ) => () => void
  header: (hash: string) => Promise<string>
  unpin: (hashes: Array<string>) => Promise<void>
  _request: <Reply, Notification>(
    method: string,
    params: any[],
    cb?: ClientRequestCb<Reply, Notification>,
  ) => UnsubscribeFn
}

export interface ChainHead {
  (
    withRuntime: false,
    cb: (event: FollowEventWithoutRuntime) => void,
    onError: (error: Error) => void,
  ): FollowResponse
  (
    withRuntime: true,
    cb: (event: FollowEventWithRuntime) => void,
    onError: (error: Error) => void,
  ): FollowResponse
}
