import {
  getChecksumBuilder,
  getLookupFn,
} from "@polkadot-api/metadata-builders"
import type { V14, V15 } from "@polkadot-api/substrate-bindings"
import { filterObject, mapObject } from "@polkadot-api/utils"
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
  if (typeof input === "string" || typeof input === "number") return input

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

export const generateDescriptors = (
  metadata: V14 | V15,
  checksums: string[],
  typesBuilder: ReturnType<typeof getTypesBuilder>,
  checksumBuilder: ReturnType<typeof getChecksumBuilder>,
  prefix: string,
  paths: {
    client: string
    checksums: string
    types: string
    descriptorValues: string
  },
) => {
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

  const mapDescriptor = <T, R>(
    descriptor: Record<string, Record<string, T>>,
    mapFn: (value: T, pallet: string, name: string) => R,
  ): Record<string, Record<string, R>> =>
    filterObject(
      mapObject(descriptor, (v, pallet) =>
        mapObject(v, (value, name) => mapFn(value, pallet, name)),
      ),
      (v) => Object.keys(v).length > 0,
    )

  const extractValue = (input: { docs: string[]; type: string }) => ({
    docs: input.docs,
    value: input.type,
  })

  const iStorage = mapDescriptor(storage, extractValue)
  const iCalls = mapDescriptor(calls, extractValue)
  const iEvents = mapDescriptor(events, extractValue)
  const iErrors = mapDescriptor(errors, extractValue)
  const iConstants = mapDescriptor(constants, extractValue)

  const pallets = mapObject(storage, (_, pallet) => {
    return [
      mapObject(storage[pallet], (x) => x.checksum),
      mapObject(calls[pallet], (x) => x.checksum),
      mapObject(events[pallet], (x) => x.checksum),
      mapObject(errors[pallet], (x) => x.checksum),
      mapObject(constants[pallet], (x) => x.checksum),
    ]
  })

  const iRuntimeCalls = mapObject(runtimeCalls, (api) => ({
    docs: api.docs,
    value: mapObject(api.methods, ({ docs, type: value }) => ({ docs, value })),
  }))

  const runtimeCallsObj = mapObject(runtimeCalls, (api) =>
    mapObject(api.methods, (x) => x.checksum),
  )

  const clientImports = [
    "StorageDescriptor",
    "PlainDescriptor",
    "AssetDescriptor",
    "TxDescriptor",
    "RuntimeDescriptor",
    "Enum",
    "_Enum",
    "Binary",
    "FixedSizeBinary",
    "FixedSizeArray",
    "QueryFromPalletsDef",
    "TxFromPalletsDef",
    "EventsFromPalletsDef",
    "ErrorsFromPalletsDef",
    "ConstFromPalletsDef",
    ...typesBuilder.getClientFileImports(),
  ]

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

  const descriptorValues = `
    export const ${prefix} = {
      pallets: ${customStringifyObject(pallets)},
      apis: ${customStringifyObject(runtimeCallsObj)}
    };
  `

  const imports = `import {${clientImports.join(", ")}} from "${paths.client}";
  import {${typesBuilder.getTypeFileImports().join(", ")}} from "${
    paths.types
  }";
  import { ${prefix} as descriptorValues } from "${paths.descriptorValues}";

  const checksums = import("${paths.checksums}").then(module => 'default' in module ? module.default : module);
  `

  const descriptorTypes = `${imports}

type AnonymousEnum<T extends {}> = T & {
  __anonymous: true
}

type MyTuple<T> = [T, ...T[]]

type SeparateUndefined<T> = undefined extends T
  ? undefined | Exclude<T, undefined>
  : T


type Anonymize<T> = SeparateUndefined<
  T extends FixedSizeBinary<infer L>
    ? number extends L
      ? Binary
      : FixedSizeBinary<L>
    : T extends
          | string
          | number
          | bigint
          | boolean
          | void
          | undefined
          | null
          | symbol
          | Uint8Array
          | Enum<any>
      ? T
      : T extends AnonymousEnum<infer V>
        ? Enum<V>
        : T extends MyTuple<any>
          ? {
              [K in keyof T]: T[K]
            }
          : T extends []
            ? []
            : T extends FixedSizeArray<infer L, infer T>
              ? number extends L
                ? Array<T>
                : FixedSizeArray<L, T>
              : {
                  [K in keyof T & string]: T[K]
                }
>

type IStorage = ${customStringifyObject(iStorage)};
type ICalls = ${customStringifyObject(iCalls)};
type IEvent = ${customStringifyObject(iEvents)};
type IError = ${customStringifyObject(iErrors)};
type IConstants = ${customStringifyObject(iConstants)};
type IRuntimeCalls = ${customStringifyObject(iRuntimeCalls)};
type IAsset = AssetDescriptor<${asset?.type ?? "void"}>
const asset: IAsset = "${asset?.checksum ?? ""}" as IAsset

type PalletsTypedef = {
  __storage: IStorage,
  __tx: ICalls,
  __event: IEvent,
  __error: IError,
  __const: IConstants
}

type IDescriptors = {
  descriptors: {
    pallets: PalletsTypedef,
    apis: IRuntimeCalls
  },
  asset: IAsset,
  checksums: Promise<string[]>
};
const _allDescriptors = { descriptors: descriptorValues, asset, checksums } as any as IDescriptors;
export default _allDescriptors;

export type ${prefix}Queries = QueryFromPalletsDef<PalletsTypedef>
export type ${prefix}Calls = TxFromPalletsDef<PalletsTypedef>
export type ${prefix}Events = EventsFromPalletsDef<PalletsTypedef>
export type ${prefix}Errors = ErrorsFromPalletsDef<PalletsTypedef>
export type ${prefix}Constants = ConstFromPalletsDef<PalletsTypedef>

export type ${prefix}WhitelistEntry =
  | PalletKey
  | ApiKey<IRuntimeCalls>
  | \`query.\${NestedKey<PalletsTypedef['__storage']>}\`
  | \`tx.\${NestedKey<PalletsTypedef['__tx']>}\`
  | \`event.\${NestedKey<PalletsTypedef['__event']>}\`
  | \`error.\${NestedKey<PalletsTypedef['__error']>}\`
  | \`const.\${NestedKey<PalletsTypedef['__const']>}\`

type PalletKey = \`*.\${keyof (typeof descriptorValues)['pallets'] & string}\`
type NestedKey<D extends Record<string, Record<string, any>>> =
  | "*"
  | {
      [P in keyof D & string]:
        | \`\${P}.*\`
        | {
            [N in keyof D[P] & string]: \`\${P}.\${N}\`
          }[keyof D[P] & string]
    }[keyof D & string]

type ApiKey<D extends Record<string, Record<string, any>>> =
  | "api.*"
  | {
      [P in keyof D & string]:
        | \`api.\${P}.*\`
        | {
            [N in keyof D[P] & string]: \`api.\${P}.\${N}\`
          }[keyof (keyof D[P]) & string]
    }[keyof D & string]

type PickDescriptors<
  Idx extends 0 | 1 | 2 | 3 | 4,
  T extends Record<string, Record<number, any>>
> = {
  [K in keyof T]: T[K][Idx]
}
`

  return { descriptorTypes, descriptorValues }
}
