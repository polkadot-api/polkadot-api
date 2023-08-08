import type { V14 } from "@unstoppablejs/substrate-bindings"
import { h64 } from "@unstoppablejs/substrate-bindings"
import { EnumVar, getLookupFn } from "./lookups"

const textEncoder = new TextEncoder()
const checksumEnhancer =
  <A extends Array<any>>(
    fn: (...args: A) => string,
  ): ((...args: A) => bigint | null) =>
  (...args) => {
    try {
      return h64(textEncoder.encode(fn(...args)))
    } catch (_) {
      return null
    }
  }

export const getChecksumBuilder = (metadata: V14) => {
  const lookupData = metadata.lookup
  const getLookupEntryDef = getLookupFn(lookupData)

  const buildDefinition = (id: number): string => getLookupEntryDef(id).shape

  const buildStorage = checksumEnhancer(
    (pallet: string, entry: string): string => {
      const storageEntry = metadata.pallets
        .find((x) => x.name === pallet)!
        .storage!.items.find((s) => s.name === entry)!

      if (storageEntry.type.tag === "plain")
        return `[],${buildDefinition(storageEntry.type.value)}`

      const { key, value } = storageEntry.type.value
      const val = buildDefinition(value)
      const returnKey =
        storageEntry.type.value.hashers.length === 1
          ? `[${buildDefinition(key)}]`
          : buildDefinition(key)
      return `${returnKey},${val}`
    },
  )

  const buildEnumEntry = (
    entry: EnumVar["value"][keyof EnumVar["value"]],
  ): string => {
    if (entry.type === "primitive") return ""

    const values = Object.values(entry.value).map((l) => buildDefinition(l.id))

    return JSON.stringify(
      entry.type === "tuple"
        ? values
        : Object.fromEntries(
            Object.keys(entry.value).map((key, idx) => [key, values[idx]]),
          ),
    )
  }

  const buildCall = checksumEnhancer(
    (pallet: string, callName: string): string => {
      const palletEntry = metadata.pallets.find((x) => x.name === pallet)!
      const callsLookup = getLookupEntryDef(palletEntry.calls! as number)

      if (callsLookup.type !== "enum") throw null
      return buildEnumEntry(callsLookup.value[callName])
    },
  )

  const buildEvent = checksumEnhancer(
    (pallet: string, eventName: string): string => {
      const eventsLookup = getLookupEntryDef(
        metadata.pallets.find((x) => x.name === pallet)!.events! as number,
      )
      if (eventsLookup.type !== "enum") throw null
      return buildEnumEntry(eventsLookup.value[eventName])
    },
  )

  const buildConstant = checksumEnhancer(
    (pallet: string, constantName: string): string => {
      const storageEntry = metadata.pallets
        .find((x) => x.name === pallet)!
        .constants!.find((s) => s.name === constantName)!

      return buildDefinition(storageEntry.type as number)
    },
  )

  return {
    buildDefinition: checksumEnhancer(buildDefinition),
    buildStorage,
    buildCall,
    buildEvent,
    buildConstant,
  }
}
