// Common
export interface Inaccessible {
  type: "inaccessible"
}

export interface Disjoint {
  type: "disjoint"
}

export interface FError {
  type: "error"
  error: string
}

export interface Stop {
  type: "stop"
}

export interface Done {
  type: "done"
}

// operation events
interface OperationEvent {
  operationId: string
}

export type OperationWaitingForContinue = OperationEvent & {
  type: "operationWaitingForContinue"
}

export type OperationInaccessible = OperationEvent & {
  type: "operationInaccessible"
}

export type OperationError = OperationEvent & {
  type: "operationError"
  error: string
}

export type CommonOperationEvents = OperationInaccessible | OperationError

export type OperationBodyDone = OperationEvent & {
  type: "operationBodyDone"
  value: Array<string>
}

export type OperationCallDone = OperationEvent & {
  type: "operationCallDone"
  output: string
}

export interface StorageItemResponse {
  key: string
  value?: string
  hash?: string
  closestDescendantMerkleValue?: string
}

export type OperationStorageItems = OperationEvent & {
  type: "operationStorageItems"
  items: Array<StorageItemResponse>
}

export type OperationStorageDone = OperationEvent & {
  type: "operationStorageDone"
}

export type OperationEvents =
  | OperationBodyDone
  | OperationCallDone
  | OperationStorageItems
  | OperationWaitingForContinue
  | OperationStorageDone
  | CommonOperationEvents

export interface StorageItemInput {
  key: string
  type:
    | "value"
    | "hash"
    | "closestDescendantMerkleValue"
    | "descendantsValues"
    | "descendantsHashes"
}

// Operation Responses
export type OperationStarted = OperationEvent & {
  result: "started"
}

export type StorageOperationStarted = OperationEvent & {
  result: "started"
  discardedItems: number
}

export interface LimitReached {
  result: "limitReached"
}
export type OperationResponse = OperationStarted | LimitReached
