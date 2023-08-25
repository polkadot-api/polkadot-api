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
      "closest-descendant-merkle-value": new Set(
        query.closestDescendantMerkleValue ?? [],
      ),
      "descendants-values": new Set(query.descendantsValues ?? []),
      "descendants-hashes": new Set(query.descendantsHashes ?? []),
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
        type: "descendants-values",
        key,
      })
    })
    query.descendantsHashes?.forEach((key) => {
      items.push({
        type: "descendants-hashes",
        key,
      })
    })
    queries["closest-descendant-merkle-value"]?.forEach((key) => {
      items.push({
        type: "closest-descendant-merkle-value",
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
            const queriedKey = [...queries["descendants-values"]]
              .filter((key) => item.key.startsWith(key))
              .sort((a, b) => b.length - a.length)[0]

            const values = result.descendantsValues[queriedKey] ?? []
            values.push({
              key: item.key,
              value: item.value,
            })
            result.descendantsValues[queriedKey] = values
          }
          return
        }

        if (item.hash) {
          if (queries.hash.has(item.key)) {
            result.hashes[item.key] = item.hash
          } else {
            // there could be many matching ones, we want to take the longest one
            const queriedKey = [...queries["descendants-hashes"]]
              .filter((key) => item.key.startsWith(key))
              .sort((a, b) => b.length - a.length)[0]

            const hashes = result.descendantsHashes[queriedKey] ?? []
            hashes.push({
              key: item.key,
              hash: item.hash,
            })
            result.descendantsHashes[queriedKey] = hashes
          }
          return
        }

        if (
          item["closest-descendant-merkle-value"] &&
          queries["closest-descendant-merkle-value"].has(item.key)
        ) {
          result.closests[item.key] = item["closest-descendant-merkle-value"]
        }
      })
    }

    return [requestArgs, resultBuilder]
  },
)
