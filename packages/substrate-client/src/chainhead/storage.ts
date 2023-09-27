import { ClientRequest, FollowResponse, OperationLimitError } from ".."
import type {
  CommonOperationEventsRpc,
  LimitReachedRpc,
  OperationStorageDoneRpc,
  OperationStorageItemsRpc,
  OperationWaitingForContinueRpc,
  OperationStorageStartedRpc,
} from "./json-rpc-types"
import { abortablePromiseFn } from "@/internal-utils"
import { createStorageCb } from "./storage-subscription"

export const createStorageFn = (
  request: ClientRequest<
    OperationStorageStartedRpc | LimitReachedRpc,
    | CommonOperationEventsRpc
    | OperationStorageItemsRpc
    | OperationStorageDoneRpc
    | OperationWaitingForContinueRpc
  >,
): FollowResponse["storage"] => {
  const cbStore = createStorageCb(request)
  return abortablePromiseFn((resolve, reject, hash, type, key, childTrie) => {
    const isDescendants = type.startsWith("descendants")
    let result: any = isDescendants ? [] : null

    const onItems: Parameters<typeof cbStore>[3] = isDescendants
      ? (items) => {
          result.push(...items)
        }
      : (items) => {
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
