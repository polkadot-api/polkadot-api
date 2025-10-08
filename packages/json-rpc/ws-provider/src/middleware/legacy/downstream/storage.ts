import { filter, map, merge } from "rxjs"
import { createUpstream } from "../upstream/upstream"

const validStorageTypes = new Set([
  "value",
  "hash",
  "closestDescendantMerkleValue",
  "descendantsValues",
  "descendantsHashes",
])

export type Items = Array<{
  key: string
  type:
    | "value"
    | "hash"
    | "closestDescendantMerkleValue"
    | "descendantsValues"
    | "descendantsHashes"
}>

export const areItemsValid = (items: any): items is Items =>
  Array.isArray(items) &&
  items.every(
    (x) =>
      typeof x === "object" &&
      typeof x.key === "string" &&
      validStorageTypes.has(x.type),
  )

export const getStg$ = (
  upstream: ReturnType<typeof createUpstream>,
  at: string,
  items: Array<{
    key: string
    type:
      | "value"
      | "hash"
      | "descendantsValues"
      | "descendantsHashes"
      | "closestDescendantMerkleValue"
  }>,
) =>
  merge(
    ...items.map(({ key, type }) => {
      switch (type) {
        case "value":
          return upstream.stgValue(at, key).pipe(
            filter(Boolean),
            map((value) => [
              {
                key,
                value,
              },
            ]),
          )
        case "hash":
          return upstream.stgHash(at, key).pipe(
            filter(Boolean),
            map((hash) => [
              {
                key,
                hash,
              },
            ]),
          )
        case "descendantsValues":
          return upstream
            .stgDescendantValues(at, key)
            .pipe(
              map((values) => values.map(([key, value]) => ({ key, value }))),
            )

        case "descendantsHashes":
          return upstream
            .stgDescendantHashes(at, key)
            .pipe(map((values) => values.map(([key, hash]) => ({ key, hash }))))

        case "closestDescendantMerkleValue":
          return upstream.stgClosestDescendant(at, key).pipe(
            filter(Boolean),
            map((closestDescendantMerkleValue) => [
              {
                key,
                closestDescendantMerkleValue,
              },
            ]),
          )
      }
    }),
  )
