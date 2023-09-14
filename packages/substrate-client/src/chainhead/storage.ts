import type {
  OperationStorageDone,
  OperationStorageItems,
  StorageItemInput,
} from "./internal-types"
import type { StorageResponse } from "./public-types"
import { createOperationPromise } from "./operation-promise"

export const createStorageFn = createOperationPromise(
  "chainHead_unstable_storage",
  (
    hash: string,
    query: Partial<{
      value: Array<string>
      hash: Array<string>
      descendantsValues: Array<string>
      descendantsHashes: Array<string>
      closestDescendantMerkleValue: Array<string>
    }>,
    childTrie: string | null,
  ) => {
    const queries: Record<StorageItemInput["type"], Set<string>> = {
      value: new Set(query.value ?? []),
      hash: new Set(query.hash ?? []),
      closestDescendantMerkleValue: new Set(
        query.closestDescendantMerkleValue ?? [],
      ),
      descendantsValues: new Set(query.descendantsValues ?? []),
      descendantsHashes: new Set(query.descendantsHashes ?? []),
    }

    const items: Array<StorageItemInput> = []
    query.value?.forEach((key) => {
      items.push({
        type: "value",
        key,
      })
    })
    query.hash?.forEach((key) => {
      items.push({
        type: "hash",
        key,
      })
    })
    query.descendantsValues?.forEach((key) => {
      items.push({
        type: "descendantsValues",
        key,
      })
    })
    query.descendantsHashes?.forEach((key) => {
      items.push({
        type: "descendantsHashes",
        key,
      })
    })
    queries["closestDescendantMerkleValue"]?.forEach((key) => {
      items.push({
        type: "closestDescendantMerkleValue",
        key,
      })
    })

    const requestArgs = [hash, items, childTrie]

    const result: StorageResponse = {
      values: {},
      hashes: {},
      closests: {},
      descendantsHashes: {},
      descendantsValues: {},
    }

    const resultBuilder = (
      e: OperationStorageItems | OperationStorageDone,
      res: (x: StorageResponse) => void,
    ) => {
      if (e.event === "operationStorageDone") return res(result)

      e.items.forEach((item) => {
        if (item.value) {
          if (queries.value.has(item.key)) {
            result.values[item.key] = item.value
          } else {
            // there could be many matching ones, we want to take the longest one
            const queriedKey = [...queries["descendantsValues"]]
              .filter((key) => item.key.startsWith(key))
              .sort((a, b) => b.length - a.length)[0]

            const values = result.descendantsValues[queriedKey] ?? []
            values.push({
              key: item.key,
              value: item.value,
            })
            result.descendantsValues[queriedKey] = values
          }
        }

        if (item.hash) {
          if (queries.hash.has(item.key)) {
            result.hashes[item.key] = item.hash
          } else {
            // there could be many matching ones, we want to take the longest one
            const queriedKey = [...queries["descendantsHashes"]]
              .filter((key) => item.key.startsWith(key))
              .sort((a, b) => b.length - a.length)[0]

            const hashes = result.descendantsHashes[queriedKey] ?? []
            hashes.push({
              key: item.key,
              hash: item.hash,
            })
            result.descendantsHashes[queriedKey] = hashes
          }
        }

        if (
          item["closestDescendantMerkleValue"] &&
          queries["closestDescendantMerkleValue"].has(item.key)
        ) {
          result.closests[item.key] = item["closestDescendantMerkleValue"]
        }
      })
    }

    return [requestArgs, resultBuilder]
  },
)
