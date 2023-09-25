import { ClientRequest, FollowResponse, OperationLimitError } from ".."
import type {
  CommonOperationEvents,
  LimitReached,
  OperationStorageDone,
  OperationStorageItems,
  OperationWaitingForContinue,
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
): FollowResponse["storage"] => {
  const cbStore = createStorageCb(request)
  return abortablePromiseFn((resolve, reject, hash, type, key, childTrie) => {
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
  })
}
