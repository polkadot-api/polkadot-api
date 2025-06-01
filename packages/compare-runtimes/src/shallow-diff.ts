import { MetadataMaps } from "./mapped-metadata"
import { Change } from "./public-types"

export const shallowDiff = (
  prev: MetadataMaps,
  next: MetadataMaps,
  type: "added" | "kept",
): Array<Change> => {
  const result: Array<Change> = []
  Object.entries(next.pallets).forEach(([palletName, data]) => {
    ;[
      "const" as const,
      "stg" as const,
      "call" as const,
      "event" as const,
      "error" as const,
      "view" as const,
    ].forEach((x) => {
      ;[...data[x as "stg"].keys()].forEach((key) => {
        const isInPrev = prev.pallets[palletName]?.[x as "stg"].has(key)
        if (type === "added" ? !isInPrev : isInPrev) {
          result.push({
            kind: x,
            pallet: palletName,
            name: key,
          })
        }
      })
    })
  })

  Object.entries(next.api).forEach(([apiGroup, val]) => {
    ;[...val.keys()].forEach((x) => {
      const isInPrev = prev.api[apiGroup]?.has(x)
      if (type === "added" ? !isInPrev : isInPrev) {
        result.push({
          kind: "api",
          group: apiGroup,
          name: x,
        })
      }
    })
  })

  return result
}
