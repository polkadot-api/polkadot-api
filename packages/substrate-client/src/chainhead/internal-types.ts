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

// operation events
interface OperationEvent {
  operationId: string
}

export type OperationWaitingForContinue = OperationEvent & {
  event: "operationWaitingForContinue"
}

export type OperationInaccessible = OperationEvent & {
  event: "operationInaccessible"
}

export type OperationError = OperationEvent & {
  event: "operationError"
  error: string
}

export type CommonOperationEvents = OperationInaccessible | OperationError

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

export type OperationStorageDone = OperationEvent & {
  event: "operationStorageDone"
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
    | "closest-descendant-merkle-value"
    | "descendants-values"
    | "descendants-hashes"
}

// Operation Responses
export type OperationStarted = OperationEvent & {
  result: "started"
}
export interface LimitReached {
  result: "limitReached"
}
export type OperationResponse = OperationStarted | LimitReached
