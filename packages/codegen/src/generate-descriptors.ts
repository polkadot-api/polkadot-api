import {
  getChecksumBuilder,
  getLookupFn,
} from "@polkadot-api/metadata-builders"
import { V15 } from "@polkadot-api/substrate-bindings"
import { mapObject } from "@polkadot-api/utils"
import { getTypesBuilder } from "./types-builder"

const isDocs = (x: any) => {
  if (typeof x !== "object") return false
  const keys = new Set(Object.keys(x))
  if (keys.size !== 2) return false
  return keys.has("docs") && keys.has("value")
}

const customStringifyObject = (
  input: string | Record<string, any> | Array<any>,
): string => {
  if (typeof input === "string") return input

  if (Array.isArray(input))
    return `[${input.map(customStringifyObject).join(", ")}]`

  return `{${Object.entries(
    mapObject(input, (x) => (isDocs(x) ? x : customStringifyObject(x))),
  )
    .map(([key, value]) => {
      if (isDocs(value)) {
        return `\n\n/**\n${value.docs
          .map((doc: string) => ` *${doc}`)
          .join("\n")}\n */\n${key}: ${customStringifyObject(value.value)}`
      }
      return `${key}: ${value}`
    })
    .join(",\n")}}`
}

export const getKnownTypesFromFileContent = (fileContent: string) => {
  const knownTypes = new Map<string, string>()
  const checksumPattern = "// "
  fileContent.split("\n").forEach((line, idx, parts) => {
    if (line.startsWith(checksumPattern)) {
      const checksum = line.slice(checksumPattern.length)
      const name = parts[idx + 1].split(" ")[1]
      knownTypes.set(checksum, name)
    }
  })
  return knownTypes
}

export const generateDescriptors = (
  metadata: V15,
  knownTypes: Map<string, string>,
  checksums: string[],
  checksumBuilder: ReturnType<typeof getChecksumBuilder>,
  paths: {
    client: string
    checksums: string
  },
) => {
  const typesBuilder = getTypesBuilder(metadata, knownTypes)
  const declarations = typesBuilder.getDeclarations()

  const buildEnumObj = <T>(
    val: number | undefined,
    cb: (name: string, docs: string[]) => T,
  ): Record<string, T> => {
    if (val === undefined) return {}

    const lookup = metadata.lookup[val]
    if (lookup.def.tag !== "variant") throw null
    return Object.fromEntries(
      lookup.def.value.map((x) => {
        return [x.name!, cb(x.name, x.docs)]
      }),
    )
  }

  const storage = Object.fromEntries(
    metadata.pallets.map((pallet) => {
      return [
        pallet.name,
        Object.fromEntries(
          pallet.storage?.items.map(({ name, modifier, docs }) => {
            const { key, val } = typesBuilder.buildStorage(pallet.name, name)
            const checksum = checksumBuilder.buildStorage(pallet.name, name)!
            const type = `StorageDescriptor<${key}, ${val}, ${!modifier}>`
            return [
              name,
              {
                checksum: checksums.indexOf(checksum),
                type,
                name: `stg_${pallet.name}_${name}`,
                docs,
              },
            ]
          }) ?? [],
        ),
      ]
    }),
  )

  const constants = Object.fromEntries(
    metadata.pallets.map((pallet) => {
      return [
        pallet.name,
        Object.fromEntries(
          pallet.constants?.map(({ name, docs }) => {
            const checksum = checksumBuilder.buildConstant(pallet.name, name)!
            const type = `PlainDescriptor<${typesBuilder.buildConstant(
              pallet.name,
              name,
            )}>`
            return [
              name,
              {
                checksum: checksums.indexOf(checksum),
                type,
                name: `const_${pallet.name}_${name}`,
                docs,
              },
            ]
          }) ?? [],
        ),
      ]
    }),
  )

  const calls = Object.fromEntries(
    metadata.pallets.map((pallet) => {
      return [
        pallet.name,
        buildEnumObj(pallet.calls, (name, docs) => ({
          checksum: checksums.indexOf(
            checksumBuilder.buildCall(pallet.name, name)!,
          ),
          type: `TxDescriptor<${typesBuilder.buildCall(pallet.name, name)}>`,
          name: `call_${pallet.name}_${name}`,
          docs,
        })),
      ]
    }),
  )

  const events = Object.fromEntries(
    metadata.pallets.map((pallet) => {
      return [
        pallet.name,
        buildEnumObj(pallet.events, (name, docs) => ({
          checksum: checksums.indexOf(
            checksumBuilder.buildEvent(pallet.name, name)!,
          ),
          type: `PlainDescriptor<${typesBuilder.buildEvent(
            pallet.name,
            name,
          )}>`,
          name: `evt_${pallet.name}_${name}`,
          docs,
        })),
      ]
    }),
  )

  const errors = Object.fromEntries(
    metadata.pallets.map((pallet) => {
      return [
        pallet.name,
        buildEnumObj(pallet.errors, (name, docs) => {
          return {
            checksum: checksums.indexOf(
              checksumBuilder.buildError(pallet.name, name)!,
            ),
            type: `PlainDescriptor<${typesBuilder.buildError(
              pallet.name,
              name,
            )}>`,
            name: `err_${pallet.name}_${name}`,
            docs,
          }
        }),
      ]
    }),
  )

  const descriptorDeclarations: string[] = []

  const runtimeCalls = Object.fromEntries(
    metadata.apis.map((api) => [
      api.name,
      {
        docs: api.docs,
        methods: Object.fromEntries(
          api.methods.map((method) => {
            const { args, value } = typesBuilder.buildRuntimeCall(
              api.name,
              method.name,
            )
            return [
              method.name,
              {
                checksum: checksums.indexOf(
                  checksumBuilder.buildRuntimeCall(api.name, method.name)!,
                ),
                type: `RuntimeDescriptor<${args}, ${value}>`,
                name: `runtime_${api.name}_${method.name}`,
                docs: method.docs,
              },
            ]
          }),
        ),
      },
    ]),
  )

  ;[
    storage,
    calls,
    events,
    errors,
    constants,
    mapObject(runtimeCalls, (x) => x.methods),
  ].forEach((entryType) => {
    Object.values(entryType).forEach((x) =>
      Object.values(x).forEach(({ checksum, type, name }) => {
        descriptorDeclarations.push(
          `const ${name}: ${type} = ${checksum} as ${type};`,
        )
      }),
    )
  })

  const iPallets = mapObject(storage, (_, pallet) => {
    return [
      mapObject(storage[pallet], ({ docs, type: value }) => ({ docs, value })),
      mapObject(calls[pallet], ({ docs, type: value }) => ({ docs, value })),
      mapObject(events[pallet], ({ docs, type: value }) => ({ docs, value })),
      mapObject(errors[pallet], ({ docs, type: value }) => ({ docs, value })),
      mapObject(constants[pallet], ({ docs, type: value }) => ({
        docs,
        value,
      })),
    ]
  })

  const pallets = mapObject(storage, (_, pallet) => {
    return [
      mapObject(storage[pallet], (x) => x.name),
      mapObject(calls[pallet], (x) => x.name),
      mapObject(events[pallet], (x) => x.name),
      mapObject(errors[pallet], (x) => x.name),
      mapObject(constants[pallet], (x) => x.name),
    ]
  })

  const iRuntimeCalls = mapObject(runtimeCalls, (api) => ({
    docs: api.docs,
    value: mapObject(api.methods, ({ docs, type: value }) => ({ docs, value })),
  }))

  const runtimeCallsObj = mapObject(runtimeCalls, (api) =>
    mapObject(api.methods, (x) => x.name),
  )

  ;[
    "StorageDescriptor",
    "PlainDescriptor",
    "AssetDescriptor",
    "TxDescriptor",
    "RuntimeDescriptor",
    "Enum",
    "_Enum",
    "GetEnum",
    "QueryFromDescriptors",
    "TxFromDescriptors",
    "EventsFromDescriptors",
    "ErrorsFromDescriptors",
    "ConstFromDescriptors",
  ].forEach((name) => {
    declarations.imports.add(name)
  })

  const imports = `import {${[...declarations.imports].join(", ")}} from "${
    paths.client
  }";
  import checksums from "${paths.checksums}" assert { type: 'json' };
  `

  const baseTypes = [...declarations.variables.values()]
    .map(({ name, type }) =>
      type.startsWith("Enum<")
        ? `export type ${name} = ${type};\nexport const ${name} = _Enum as unknown as GetEnum<${name}>;`
        : `type ${name} = ${type};`,
    )
    .join("\n\n")

  const assetPayment = metadata.extrinsic.signedExtensions.find(
    (x) => x.identifier === "ChargeAssetTxPayment",
  )

  let _assetId: null | number = null
  if (assetPayment) {
    const assetTxPayment = getLookupFn(metadata.lookup)(assetPayment.type)
    if (assetTxPayment.type === "struct") {
      const optionalAssetId = assetTxPayment.value.asset_id
      if (optionalAssetId.type === "option") _assetId = optionalAssetId.value.id
    }
  }

  const asset =
    _assetId === null
      ? null
      : {
          checksum: checksumBuilder.buildDefinition(_assetId),
          type: typesBuilder.buildTypeDefinition(_assetId),
        }

  return `${imports}

type AnonymousEnum<T extends {}> = T & {
  __anonymous: true
}

type IEnum<T extends {}> = Enum<{
  [K in keyof T & string]: { type: K, value: T[K] }
}[keyof T & string]>

type MyTuple<T> = [T, ...T[]]

type SeparateUndefined<T> = undefined extends T
  ? undefined | Exclude<T, undefined>
  : T

type Anonymize<T> = SeparateUndefined<
  T extends
    | string
    | number
    | bigint
    | boolean
    | void
    | undefined
    | null
    | symbol
    | Binary
    | Uint8Array
    | Enum<{ type: string; value: any }>
    ? T
    : T extends AnonymousEnum<infer V>
      ? IEnum<V>
      : T extends MyTuple<any>
        ? {
            [K in keyof T]: T[K]
          }
        : T extends []
          ? []
          : T extends Array<infer A>
            ? Array<A>
            : {
                [K in keyof T & string]: T[K]
              }
>

${baseTypes}

${descriptorDeclarations.join("\n")}

type IPallets = ${customStringifyObject(iPallets)};
export const pallets: IPallets = ${customStringifyObject(pallets)};

type IRuntimeCalls = ${customStringifyObject(iRuntimeCalls)};
export const apis: IRuntimeCalls = ${customStringifyObject(runtimeCallsObj)};

type IAsset = AssetDescriptor<${asset?.type ?? "void"}>
const asset: IAsset = "${asset?.checksum ?? ""}" as IAsset

type IDescriptors = { pallets: IPallets, apis: IRuntimeCalls, asset: IAsset, checksums: string[] };
const _allDescriptors: IDescriptors = { pallets, apis, asset, checksums };
export default _allDescriptors;


export type Queries = QueryFromDescriptors<IDescriptors>
export type Calls = TxFromDescriptors<IDescriptors>
export type Events = EventsFromDescriptors<IDescriptors>
export type Errors = ErrorsFromDescriptors<IDescriptors>
export type Constants = ConstFromDescriptors<IDescriptors>
`
}
