import { abortablePromiseFn } from "@/internal-utils"
import type { Archive } from "./public-types"

export const createStorageFn = (
  cbStore: Archive["storageSubscription"],
): Archive["storage"] =>
  abortablePromiseFn((resolve, reject, hash, type, key, childTrie) => {
    const isDescendants = type.startsWith("descendants")

    let result: any = isDescendants ? [] : null
    const onItem: Parameters<typeof cbStore>[3] = isDescendants
      ? result.push.bind(result)
      : ({ [type]: res }) => {
          result = res
        }

    return cbStore(
      hash,
      [{ key, type }],
      childTrie,
      onItem,
      (e) => {
        reject(e)
        result = null
      },
      () => {
        resolve(result)
        result = null
      },
    )
  })
