import { getMetadata } from "./metadata"
import type { AsyncReturnType } from "type-fest"

export function blowupMetadata(
  metadata: AsyncReturnType<typeof getMetadata>["metadata"],
) {
  const { pallets, lookup } = metadata.value

  for (const pallet of pallets) {
    popRandom(pallet.constants)
    popRandom(pallet.storage?.items ?? [])

    const events = lookup.find((l) => l.id == pallet.events)
    if (events?.def.tag === "variant") {
      popRandom(events.def.value)
    }

    const errors = lookup.find((l) => l.id == pallet.errors)
    if (errors?.def.tag === "variant") {
      popRandom(errors.def.value)
    }

    const calls = lookup.find((l) => l.id == pallet.calls)
    if (calls?.def.tag === "variant") {
      popRandom(calls.def.value)
    }
  }
}

function popRandom<A>(arr: A[]) {
  arr.splice(Math.floor(Math.random() * arr.length), 1)
}
