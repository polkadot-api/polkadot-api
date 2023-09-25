import { OperationLimitError } from ".."
import type { ClientRequest, FollowResponse, StorageResult } from ".."
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
): FollowResponse["storage"] => {
  const cbStore = createStorageCb(request)
  return abortablePromiseFn((resolve, reject, hash, type, key, childTrie) => {
    const result: {
      value: StorageResult<"value">
      hash: StorageResult<"hash">
      closestDescendantMerkleValue: StorageResult<"closestDescendantMerkleValue">
      descendantsValues: StorageResult<"descendantsValues">
      descendantsHashes: StorageResult<"descendantsHashes">
    } = {
      value: null,
      hash: null,
      closestDescendantMerkleValue: null,
      descendantsValues: [],
      descendantsHashes: [],
    }
    const onItems = (items: StorageItemResponse[]) => {
      if (isDescendantsValues(type)) {
        result[type].push(...(items as Array<{ key: string; value: string }>))
      }
      if (isDescendantsHashes(type)) {
        result[type].push(...(items as Array<{ key: string; hash: string }>))
      }
      if (
        isValue(type) ||
        isHash(type) ||
        isClosestDescendantMerkleValue(type)
      ) {
        result[type] = items[0]?.[type] ?? null
      }
    }

    const cancel = cbStore(
      hash,
      [{ key, type }],
      childTrie,
      onItems,
      reject,
      () => resolve(result[type] as StorageResult<typeof type>),
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

function isValue<T extends StorageItemInput["type"]>(
  type: T,
): type is Extract<T, "value"> {
  return type === "value"
}

function isHash<T extends StorageItemInput["type"]>(
  type: T,
): type is Extract<T, "hash"> {
  return type === "hash"
}

function isClosestDescendantMerkleValue<T extends StorageItemInput["type"]>(
  type: T,
): type is Extract<T, "closestDescendantMerkleValue"> {
  return type === "closestDescendantMerkleValue"
}

function isDescendantsValues<T extends StorageItemInput["type"]>(
  type: T,
): type is Extract<T, "descendantsValues"> {
  return type === "descendantsValues"
}

function isDescendantsHashes<T extends StorageItemInput["type"]>(
  type: T,
): type is Extract<T, "descendantsHashes"> {
  return type === "descendantsHashes"
}
