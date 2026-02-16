import { LookupEntry } from "@polkadot-api/metadata-builders"
import { UnifiedMetadata } from "@polkadot-api/substrate-bindings"
import type {
  StructVar,
  ArrayVar,
  TupleVar,
  VoidVar,
} from "@polkadot-api/metadata-builders"
import { mapObject } from "@polkadot-api/utils"

export type EnumEntry = (
  | VoidVar
  | TupleVar
  | StructVar
  | ArrayVar
  | {
      type: "lookupEntry"
      value: LookupEntry
    }
) & {
  idx: number
}

export type MetadataMaps = {
  pallets: Record<
    string,
    {
      storage: Map<
        string,
        NonNullable<
          UnifiedMetadata["pallets"][number]["storage"]
        >["items"][number]
      >
      event: Map<string, EnumEntry>
      error: Map<string, EnumEntry>
      call: Map<string, EnumEntry>
      const: Map<
        string,
        NonNullable<UnifiedMetadata["pallets"][number]["constants"]>[number]
      >
      view: Map<
        string,
        NonNullable<UnifiedMetadata["pallets"][number]["viewFns"]>[number]
      >
    }
  >
  api: Record<
    string,
    Map<string, NonNullable<UnifiedMetadata["apis"][number]["methods"][number]>>
  >
  extensions: Record<
    number,
    Record<string, { type: number; additionalSigned: number }>
  >
}

const buildVariants = (
  metadata: UnifiedMetadata,
  lookupFn: (id: number) => LookupEntry,
) =>
  Object.fromEntries(
    metadata.pallets.map((palletEntry) => {
      const [error, event, call] = [
        "errors" as const,
        "events" as const,
        "calls" as const,
      ].map((variantType) => {
        try {
          const lookup = lookupFn(palletEntry[variantType]!.type)
          if (lookup.type !== "enum") throw null
          return new Map(Object.entries(lookup.value))
        } catch {
          return new Map()
        }
      })
      return [palletEntry.name, { error, event, call }]
    }),
  )

export const getMappedMetadata = (
  metadata: UnifiedMetadata,
  lookupFn: (id: number) => LookupEntry,
): MetadataMaps => {
  const palletVariants = buildVariants(metadata, lookupFn)
  const rest = Object.fromEntries(
    metadata.pallets.map((palletEntry) => {
      const [constants, view] = ["constants" as const, "viewFns" as const].map(
        (entryType) => new Map(palletEntry[entryType].map((x) => [x.name, x])),
      )
      return [palletEntry.name, { const: constants, view }]
    }),
  ) as Record<string, Pick<MetadataMaps["pallets"][string], "const" | "view">>
  const storage = Object.fromEntries(
    metadata.pallets.map((palletEntry) => [
      palletEntry.name,
      new Map((palletEntry.storage?.items || []).map((x) => [x.name, x])),
    ]),
  ) as Record<string, MetadataMaps["pallets"][string]["storage"]>

  const pallets: MetadataMaps["pallets"] = mapObject(
    palletVariants,
    ({ error, event, call }, key) => ({
      error,
      event,
      call,
      storage: storage[key],
      ...rest[key],
    }),
  )

  const api: MetadataMaps["api"] = Object.fromEntries(
    metadata.apis.map((x) => [
      x.name,
      new Map(x.methods.map((m) => [m.name, m])),
    ]),
  )

  return {
    pallets,
    api,
    extensions: mapObject(metadata.extrinsic.signedExtensions, (extensions) =>
      Object.fromEntries(
        extensions.map(({ identifier, ...rest }) => [identifier, rest]),
      ),
    ),
  }
}
