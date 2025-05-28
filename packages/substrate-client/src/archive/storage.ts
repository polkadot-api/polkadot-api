import { abortablePromiseFn } from "@/internal-utils"
import type { Archive } from "./public-types"

export const createStorageFn = (
  cbStore: Archive["storageSubscription"],
): Archive["storage"] =>
  abortablePromiseFn((resolve, reject, hash, type, key, childTrie) => {
    const isDescendants = type.startsWith("descendants")
    let result: any = isDescendants ? [] : null

    const onItem: Parameters<typeof cbStore>[3] = isDescendants
      ? (items) => {
          result.push(items)
        }
      : (items) => {
          result = items?.[type as "value"]
        }

    return cbStore(
      hash,
      [{ key, type }],
      childTrie ?? null,
      onItem,
      (e) => {
        result = null
        reject(e)
      },
      () => {
        try {
          resolve(result)
        } catch (e) {
          reject(e)
        } finally {
          result = null
        }
      },
    )
  })
