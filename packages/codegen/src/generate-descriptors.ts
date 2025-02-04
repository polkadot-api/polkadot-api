import {
  getChecksumBuilder,
  MetadataLookup,
} from "@polkadot-api/metadata-builders"
import { filterObject, mapObject } from "@polkadot-api/utils"
import { anonymizeImports, anonymizeType } from "./anonymize"
import { getTypesBuilder } from "./types-builder"

const isDocs = (x: any) => {
  if (typeof x !== "object") return false
  const keys = new Set(Object.keys(x))
  if (keys.size !== 2) return false
  return keys.has("docs") && keys.has("value")
}

export const customStringifyObject = (
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

// type -> pallet -> name
export type DescriptorValues = Record<
  "storage" | "tx" | "events" | "constants" | "apis",
  Record<string, Record<string, number>>
>

export function capitalize(value: string) {
  return value.slice(0, 1).toUpperCase() + value.slice(1)
}

export const generateDescriptors = (
  lookupFn: MetadataLookup,
  checksumToIdx: Map<string, number>,
  typesBuilder: ReturnType<typeof getTypesBuilder>,
  checksumBuilder: ReturnType<typeof getChecksumBuilder>,
  key: string,
  paths: {
    client: string
    metadataTypes: string
    types: string
    descriptorValues: string
  },
  genesis?: string,
) => {
  const prefix = capitalize(key)
  const { metadata } = lookupFn
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
            const { key, val, opaque } = typesBuilder.buildStorage(
              pallet.name,
              name,
            )
            const checksum = checksumBuilder.buildStorage(pallet.name, name)!
            const type = `StorageDescriptor<${key}, ${val}, ${!modifier}, ${opaque}>`
            return [
              name,
              {
                typeRef: checksumToIdx.get(checksum)!,
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
                typeRef: checksumToIdx.get(checksum)!,
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
          typeRef: checksumToIdx.get(
            checksumBuilder.buildCall(pallet.name, name)!,
          )!,
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
          typeRef: checksumToIdx.get(
            checksumBuilder.buildEvent(pallet.name, name)!,
          )!,
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
            typeRef: checksumToIdx.get(
              checksumBuilder.buildError(pallet.name, name)!,
            )!,
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
                typeRef: checksumToIdx.get(
                  checksumBuilder.buildRuntimeCall(api.name, method.name)!,
                )!,
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

  const descriptorValues: DescriptorValues = {
    storage: {},
    tx: {},
    events: {},
    constants: {},
    apis: {},
  }
  const mapObjStr = mapObject as <I, O>(
    input: Record<string, I>,
    mapper: (i: I, k: string) => O,
  ) => Record<string, O>
  Object.keys(storage).forEach((pallet) => {
    descriptorValues["storage"][pallet] = mapObjStr(
      storage[pallet],
      (x, _: string) => x.typeRef,
    )
    descriptorValues["tx"][pallet] = mapObjStr(calls[pallet], (x) => x.typeRef)
    descriptorValues["events"][pallet] = mapObjStr(
      events[pallet],
      (x) => x.typeRef,
    )
    descriptorValues["constants"][pallet] = mapObjStr(
      constants[pallet],
      (x) => x.typeRef,
    )
  })

  const iRuntimeCalls = mapObject(runtimeCalls, (api) => ({
    docs: api.docs,
    value: mapObject(api.methods, ({ docs, type: value }) => ({ docs, value })),
  }))

  if (lookupFn.call) {
    // Generate the types to have it included in common types
    typesBuilder.buildDefinition(lookupFn.call)
  }

  const callInterface = lookupFn.call
    ? `I${checksumBuilder.buildDefinition(lookupFn.call)}`
    : null

  // & { value: { type: string }} to remove pallets without tx (otherwise it's not assignable to TxCallData)
  const chainCallType = callInterface
    ? `export type ${prefix}CallData = Anonymize<${callInterface}> & { value: { type: string } };`
    : ""

  descriptorValues["apis"] = mapObject(runtimeCalls, (api) =>
    mapObject(api.methods, (x) => x.typeRef),
  )

  const clientImports = [
    ...new Set([
      "StorageDescriptor",
      "PlainDescriptor",
      "TxDescriptor",
      "RuntimeDescriptor",
      "Enum",
      "_Enum",
      "GetEnum",
      "QueryFromPalletsDef",
      "TxFromPalletsDef",
      "EventsFromPalletsDef",
      "ErrorsFromPalletsDef",
      "ConstFromPalletsDef",
      ...typesBuilder.getClientFileImports(),
      ...anonymizeImports,
    ]),
  ]

  const assetId = getAssetId(lookupFn)
  const assetType =
    assetId == null ? "void" : typesBuilder.buildTypeDefinition(assetId)

  const dispatchErrorId = getDispatchErrorId(lookupFn)
  const dispatchErrorType =
    dispatchErrorId == null
      ? "unknown"
      : typesBuilder.buildTypeDefinition(dispatchErrorId)

  const commonTypeImports = typesBuilder.getTypeFileImports()

  const exports = [
    `default as ${key}`,
    callInterface ? `${prefix}CallData` : null,
  ].filter((v) => v !== null)

  // Going through base64 conversion instead of using binary loader because of esbuild issue
  // https://github.com/evanw/esbuild/issues/3894
  const imports = `import {${clientImports.join(", ")}} from "${paths.client}";
  import {${commonTypeImports.join(", ")}} from "${paths.types}";

  const toBinary = (() => {
    const table = new Uint8Array(128);
    for (let i = 0; i < 64; i++) table[i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i * 4 - 205] = i;
    return (base64: string) => {
      const n = base64.length,
        bytes = new Uint8Array((n - Number(base64[n - 1] === '=') - Number(base64[n - 2] === '=')) * 3 / 4 | 0);
      for (let i2 = 0, j = 0; i2 < n;) {
        const c0 = table[base64.charCodeAt(i2++)], c1 = table[base64.charCodeAt(i2++)];
        const c2 = table[base64.charCodeAt(i2++)], c3 = table[base64.charCodeAt(i2++)];
        bytes[j++] = c0 << 2 | c1 >> 4;
        bytes[j++] = c1 << 4 | c2 >> 2;
        bytes[j++] = c2 << 6 | c3;
      }
      return bytes;
    };
  })();

  const descriptorValues = import("${paths.descriptorValues}").then(module => module["${prefix}"]);
  const metadataTypes = import("${paths.metadataTypes}").then(
    module => toBinary('default' in module ? module.default : module)
  );
  `

  const descriptorTypes = `${imports}

${anonymizeType}

type IStorage = ${customStringifyObject(iStorage)};
type ICalls = ${customStringifyObject(iCalls)};
type IEvent = ${customStringifyObject(iEvents)};
type IError = ${customStringifyObject(iErrors)};
type IConstants = ${customStringifyObject(iConstants)};
type IRuntimeCalls = ${customStringifyObject(iRuntimeCalls)};
type IAsset = PlainDescriptor<${assetType}>
export type ${prefix}DispatchError = ${dispatchErrorType}
const asset: IAsset = {} as IAsset
const getMetadata: () => Promise<Uint8Array> = () => import("./${key}_metadata.ts").then(
  module => toBinary('default' in module ? module.default : module)
)
const genesis: string | undefined = ${genesis ? `"${genesis}"` : undefined}

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
  } & Promise<any>,
  metadataTypes: Promise<Uint8Array>
  asset: IAsset
  getMetadata: () => Promise<Uint8Array>
  genesis: string | undefined
};
const _allDescriptors = { descriptors: descriptorValues, metadataTypes, asset, getMetadata } as any as IDescriptors;
export default _allDescriptors;

export type ${prefix}Queries = QueryFromPalletsDef<PalletsTypedef>
export type ${prefix}Calls = TxFromPalletsDef<PalletsTypedef>
export type ${prefix}Events = EventsFromPalletsDef<PalletsTypedef>
export type ${prefix}Errors = ErrorsFromPalletsDef<PalletsTypedef>
export type ${prefix}Constants = ConstFromPalletsDef<PalletsTypedef>
${chainCallType}

export type ${prefix}WhitelistEntry =
  | PalletKey
  | ApiKey<IRuntimeCalls>
  | \`query.\${NestedKey<PalletsTypedef['__storage']>}\`
  | \`tx.\${NestedKey<PalletsTypedef['__tx']>}\`
  | \`event.\${NestedKey<PalletsTypedef['__event']>}\`
  | \`error.\${NestedKey<PalletsTypedef['__error']>}\`
  | \`const.\${NestedKey<PalletsTypedef['__const']>}\`

type PalletKey = \`*.\${keyof (IStorage & ICalls & IEvent & IError & IConstants & IRuntimeCalls)}\`
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
          }[keyof D[P] & string]
    }[keyof D & string]
`

  return { descriptorTypes, descriptorValues, exports }
}

export function getAssetId(lookup: MetadataLookup) {
  const assetPayment = lookup.metadata.extrinsic.signedExtensions.find(
    (x) => x.identifier === "ChargeAssetTxPayment",
  )

  if (assetPayment) {
    const assetTxPayment = lookup(assetPayment.type)
    if (assetTxPayment.type === "struct") {
      const optionalAssetId = assetTxPayment.value.asset_id
      if (optionalAssetId.type === "option") return optionalAssetId.value.id
    }
  }
  return
}

export function getDispatchErrorId(lookup: MetadataLookup) {
  const systemPalletEventId = lookup.metadata.pallets.find(
    (p) => p.name === "System",
  )?.events
  if (systemPalletEventId == null) return

  const systemPalletEvent = lookup(systemPalletEventId)
  if (systemPalletEvent.type !== "enum") return

  const extrinsicFailed = systemPalletEvent.value.ExtrinsicFailed
  if (extrinsicFailed?.type !== "struct") return

  return extrinsicFailed.value.dispatch_error.id
}
