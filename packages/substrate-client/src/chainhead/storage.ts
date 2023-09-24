import { ClientRequest, OperationLimitError, StorageResult } from ".."
import type {
  CommonOperationEvents,
  LimitReached,
  OperationStorageDone,
  OperationStorageItems,
  OperationWaitingForContinue,
  StorageItemInput,
  StorageItemResponse,
  StorageOperationStarted,
} from "./internal-types"
import { abortablePromiseFn } from "@/internal-utils"
import { createStorageCb } from "./storage-subscription"

export const createStorageFn = (
  request: ClientRequest<
    StorageOperationStarted | LimitReached,
    | CommonOperationEvents
    | OperationStorageItems
    | OperationStorageDone
    | OperationWaitingForContinue
  >,
) => {
  const cbStore = createStorageCb(request)
  return abortablePromiseFn(
    <Type extends StorageItemInput["type"]>(
      resolve: (value: StorageResult<Type>) => void,
      reject: (e: Error) => void,
      hash: string,
      type: Type,
      key: string,
      childTrie: string | null,
    ) => {
      const isDescendants = type.startsWith("descendants")
      let result: any = isDescendants ? [] : null

      const onItems = isDescendants
        ? (items: StorageItemResponse[]) => {
            result.push(...items)
          }
        : (items: StorageItemResponse[]) => {
            result = items[0]?.[type as "value"]
          }

      const cancel = cbStore(
        hash,
        [{ key, type }],
        childTrie ?? null,
        onItems,
        reject,
        () => {
          resolve(result)
        },
        (nDiscarded) => {
          if (nDiscarded > 0) {
            cancel()
            reject(new OperationLimitError())
          }
        },
      )
      return cancel
    },
  )
}
