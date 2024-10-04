import { denormalizeLookup, LookupEntry } from "@polkadot-api/metadata-builders"
import { V14Lookup, v14Lookup } from "@polkadot-api/substrate-bindings"
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

  const getLookupEntryDef = denormalizeLookup(decoded)
  const storage = getStorageLayout(metadata, getLookupEntryDef, decoded)

  return Object.assign(getLookupEntryDef, {
    metadata,
    lookup: decoded,
    storage,
  })
}

function getStorageLayout(
  metadata: InkMetadata,
  lookupFn: (id: number) => LookupEntry,
  lookup: V14Lookup,
) {
  const result: StorageLayout = {}

  const readLayout = (
    node: Layout,
    path: string[] = [],
    create = true,
  ): number | null => {
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
      let entryPoint: StorageEntryPoint | null = null
      const keyPrefix = node.root.root_key

      if (node.root.ty != null) {
        // If the type referenced by this node is a real type, then traverse the layout without creating intermediate nodes.
        readLayout(node.root.layout, path, false)

        let type = metadata.types[node.root.ty].type

        // A vector internally uses a Mapping, but we have to get it
        const fields =
          "composite" in type.def
            ? new Map(
                (type.def.composite.fields ?? []).map((v) => [v.name, v.type]),
              )
            : null
        let params = new Map((type.params ?? []).map((v) => [v.name, v.type]))
        if (
          params.size === 2 &&
          params.has("V") &&
          fields &&
          fields.size === 2 &&
          fields.has("len") &&
          fields.has("elements")
        ) {
          type = metadata.types[fields.get("elements")!].type
          params = new Map(type.params.map((v) => [v.name, v.type]))
        }

        if (params.size === 3 && params.has("K") && params.has("V")) {
          // Mapping
          entryPoint = {
            keyPrefix: node.root.root_key,
            key: params.get("K")!,
            typeId: params.get("V")!,
          }
        } else if (params.size === 2 && params.has("V")) {
          // Lazy
          entryPoint = {
            keyPrefix: node.root.root_key,
            key: null,
            typeId: params.get("V")!,
          }
        } else if (lookupFn(node.root.ty).type != "void") {
          entryPoint = {
            keyPrefix,
            key: null,
            typeId: node.root.ty,
          }
        }
      }

      result[path.join(".")] = entryPoint ?? {
        keyPrefix,
        key: null,
        typeId: readLayout(node.root.layout, path, true)!,
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
      const inner = readLayout(node.array.layout, path, create)

      if (create) {
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

      return null
    }
    if ("struct" in node) {
      const inner = node.struct.fields
        .map((field) => ({
          name: field.name,
          type: readLayout(field.layout, [...path, field.name], create)!,
          typeName: undefined,
          docs: [],
        }))
        .filter((field) => field.type != null)

      if (create) {
        return addType({
          tag: "composite",
          value: inner,
        })
      }
      return null
    }

    const inner = Object.values(node.enum.variants).map((variant, index) => ({
      name: variant.name,
      fields: variant.fields
        .map((field) => ({
          name: field.name,
          type: readLayout(
            field.layout,
            [...path, variant.name, field.name],
            create,
          )!,
          typeName: undefined,
          docs: [],
        }))
        .filter((v) => v.type !== null),
      index,
      docs: [],
    }))

    if (create) {
      return addType({
        tag: "variant",
        value: inner,
      })
    }
    return null
  }
  readLayout(metadata.storage)

  return result
}
