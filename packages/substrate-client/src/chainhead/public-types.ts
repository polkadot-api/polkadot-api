import type { AbortablePromiseFn, UnsubscribeFn } from "@/common-types"
import { Subscriber } from "@/internal-utils"

export type FollowInnerSubscriptionCb<T> = (
  subscriptionId: string,
  cb: Subscriber<T>,
) => UnsubscribeFn

export type ClientInnerRequestCb<T, TT> = {
  onSuccess: (
    result: T,
    followSubscription: FollowInnerSubscriptionCb<TT>,
  ) => void
  onError: (e: Error) => void
}

export type ClientInnerRequest<T, TT> = (
  method: string,
  params: Array<any>,
  cb?: ClientInnerRequestCb<T, TT>,
) => UnsubscribeFn

export interface StorageItemInput {
  key: string
  type:
    | "value"
    | "hash"
    | "closestDescendantMerkleValue"
    | "descendantsValues"
    | "descendantsHashes"
}

export interface StorageItemResponse {
  key: string
  value?: string
  hash?: string
  closestDescendantMerkleValue?: string
}

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

export type StorageResult<Input extends StorageItemInput["type"]> =
  Input extends "descendantsHashes"
    ? Array<{ key: string; hash: string }>
    : Input extends "descendantsValues"
      ? Array<{ key: string; value: string }>
      : string | null

export interface FollowResponse {
  unfollow: UnsubscribeFn
  body: AbortablePromiseFn<[hash: string], Array<string>>
  call: AbortablePromiseFn<
    [hash: string, fnName: string, callParameters: string],
    string
  >
  storage: <Type extends StorageItemInput["type"]>(
    hash: string,
    type: Type,
    key: string,
    childTrie: string | null,
    abortSignal?: AbortSignal | undefined,
  ) => Promise<StorageResult<Type>>
  storageSubscription: (
    hash: string,
    inputs: Array<StorageItemInput>,
    childTrie: string | null,
    onItems: (items: Array<StorageItemResponse>) => void,
    onError: (e: Error) => void,
    onDone: () => void,
    onDiscardedItems: (nDiscarded: number) => void,
  ) => () => void
  header: (hash: string) => Promise<string>
  unpin: (hashes: Array<string>) => Promise<void>
  _request: <Reply, Notification>(
    method: string,
    params: any[],
    cb?: ClientInnerRequestCb<Reply, Notification>,
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
