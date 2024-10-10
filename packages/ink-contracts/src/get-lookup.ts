import { denormalizeLookup, LookupEntry } from "@polkadot-api/metadata-builders"
import { Binary, V14Lookup, v14Lookup } from "@polkadot-api/substrate-bindings"
import { InkMetadata, Layout } from "./metadata-types"
import { pjsTypes } from "./metadata-pjs-types"

export interface InkMetadataLookup {
  (id: number): LookupEntry
  metadata: InkMetadata
  storage: StorageLayout
}

export interface StorageEntryPoint {
  keyPrefix: string
  key: number | null
  typeId: number
}

export type StorageLayout = Record<string, StorageEntryPoint>

export const getInkLookup = (metadata: InkMetadata): InkMetadataLookup => {
  // We can reuse dynamic-builder's lookup if we encode and re-decode the type
  // into V14Lookup, because both v14 metadata lookup and ink types use scale-info
  const encoded = pjsTypes.enc(metadata.types)
  const decoded = v14Lookup.dec(encoded)

  // Signal the lookup the AccountId type
  const accountTypeId = metadata.spec.environment.accountId.type
  const accountIdEntry = decoded.find((e) => e.id === accountTypeId)
  if (accountIdEntry) {
    accountIdEntry.path = ["AccountId32"]
  }

  const storage = getStorageLayout(metadata, decoded)
  const getLookupEntryDef = denormalizeLookup(decoded)

  return Object.assign(getLookupEntryDef, {
    metadata,
    lookup: decoded,
    storage,
  })
}

function getStorageLayout(metadata: InkMetadata, lookup: V14Lookup) {
  const result: StorageLayout = {}

  const readLayout = (node: Layout, path: string[] = []): number | null => {
    function addType(def: V14Lookup[number]["def"]) {
      const id = lookup.length
      lookup[id] = {
        id,
        docs: [],
        def,
        params: [],
        path: [],
      }
      return id
    }

    if ("root" in node) {
      // On version 4-, the keys in the storage were in big-endian.
      // For version 5+, the keys in storage are in scale, which is little-endian.
      // https://use.ink/faq/migrating-from-ink-4-to-5#metadata-storage-keys-encoding-change
      // https://github.com/use-ink/ink/pull/2048
      const keyPrefix =
        Number(metadata.version) === 4
          ? Binary.fromBytes(
              Binary.fromHex(node.root.root_key).asBytes().reverse(),
            ).asHex()
          : node.root.root_key

      const typeId = readLayout(node.root.layout, path)!
      if (node.root.ty != null) {
        function resolveType(id: number, path: string[]) {
          const type = metadata.types[id].type

          // A vector internally uses a Mapping, but we have to get it
          const fields =
            "composite" in type.def
              ? new Map(
                  (type.def.composite.fields ?? []).map((v) => [
                    v.name,
                    v.type,
                  ]),
                )
              : null
          const params = new Map(
            (type.params ?? []).map((v) => [v.name, v.type]),
          )

          if (
            params.size === 2 &&
            params.has("V") &&
            fields &&
            fields.size === 2 &&
            fields.has("len") &&
            fields.has("elements")
          ) {
            // Vectors have length and elements as different entry points
            resolveType(fields.get("len")!, [...path, "len"])
            resolveType(fields.get("elements")!, path)
            return
          } else if (params.size === 3 && params.has("K") && params.has("V")) {
            // Mapping
            result[path.join(".")] = {
              keyPrefix,
              key: params.get("K")!,
              typeId: params.get("V")!,
            }
          } else if (params.size === 2 && params.has("V")) {
            // Lazy
            result[path.join(".")] = {
              keyPrefix,
              key: null,
              typeId: params.get("V")!,
            }
          }
        }
        resolveType(node.root.ty, path)
      }

      if (!result[path.join(".")]) {
        result[path.join(".")] = {
          keyPrefix,
          key: null,
          typeId,
        }
      }

      // Anyone addressing this node will encounter an empty type
      return null
    }
    if ("leaf" in node) {
      return node.leaf.ty
    }
    if ("hash" in node) {
      throw new Error("HashLayout not implemented")
    }
    if ("array" in node) {
      const inner = readLayout(node.array.layout, path)

      return inner == null
        ? null
        : addType({
            tag: "array",
            value: {
              len: node.array.len,
              type: inner,
            },
          })
    }
    if ("struct" in node) {
      const inner = node.struct.fields
        .map((field) => ({
          name: field.name,
          type: readLayout(field.layout, [...path, field.name])!,
          typeName: undefined,
          docs: [],
        }))
        .filter((field) => field.type != null)

      return addType({
        tag: "composite",
        value: inner,
      })
    }

    const inner = Object.values(node.enum.variants).map((variant, index) => ({
      name: variant.name,
      fields: variant.fields
        .map((field) => ({
          name: field.name,
          type: readLayout(field.layout, [...path, variant.name, field.name])!,
          typeName: undefined,
          docs: [],
        }))
        .filter((v) => v.type !== null),
      index,
      docs: [],
    }))

    return addType({
      tag: "variant",
      value: inner,
    })
  }
  readLayout(metadata.storage)

  return result
}
