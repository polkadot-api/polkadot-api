import {
  StorageItemInput,
  StorageItemResponse,
  StorageResult,
} from "@/chainhead"
import type { AbortablePromiseFn } from "../common-types"

export type ArchiveStorageItemInput = StorageItemInput & {
  paginationStartKey?: string
}

export interface Archive {
  body: AbortablePromiseFn<[hash: string], Array<string>>
  call: AbortablePromiseFn<
    [hash: string, fnName: string, callParameters: string],
    string
  >
  header: (hash: string) => Promise<string>
  finalizedHeight: AbortablePromiseFn<[], number>
  hashByHeight: AbortablePromiseFn<[height: number], string[]>
  storage: <Type extends StorageItemInput["type"]>(
    hash: string,
    type: Type,
    key: string,
    childTrie: string | null,
    abortSignal?: AbortSignal | undefined,
  ) => Promise<StorageResult<Type>>
  storageSubscription: (
    hash: string,
    inputs: Array<ArchiveStorageItemInput>,
    childTrie: string | null,
    onItem: (item: StorageItemResponse) => void,
    onError: (e: Error) => void,
    onDone: () => void,
  ) => () => void
}
