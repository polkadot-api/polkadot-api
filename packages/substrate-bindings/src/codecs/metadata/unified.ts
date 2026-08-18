import { CodecType } from "scale-ts"
import { V14Lookup } from "./lookup"
import { storageMap } from "./pallets"
import { HexString } from "../scale"
import { itemDeprecation, variantDeprecation } from "./deprecation"
import { viewFunction } from "./runtime-api"
import { V14 } from "./v14"
import { V16 } from "./v16"
import { V15 } from "./v15"
import { Metadata } from "./metadata"

type EnumRef<T> =
  | ({
      type: number
    } & (T extends 16
      ? { deprecationInfo: CodecType<typeof variantDeprecation> }
      : {}))
  | undefined

type DeprecationInfo<T> = T extends 16
  ? { deprecationInfo: CodecType<typeof itemDeprecation> }
  : {}

export type UnifiedMetadata<T extends 14 | 15 | 16 = 14 | 15 | 16> = {
  version: T
  lookup: V14Lookup
  pallets: Array<
    {
      name: string
      storage:
        | {
            prefix: string
            items: Array<
              {
                name: string
                modifier: number
                type:
                  | { tag: "plain"; value: number }
                  | { tag: "map"; value: CodecType<typeof storageMap> }
                fallback: HexString
                docs: string[]
              } & DeprecationInfo<T>
            >
          }
        | undefined
      calls: EnumRef<T>
      events: EnumRef<T>
      constants: Array<
        {
          name: string
          type: number
          value: HexString
          docs: string[]
        } & DeprecationInfo<T>
      >
      errors: EnumRef<T>
      associatedTypes: Array<{
        name: string
        type: number
        docs: string[]
      }>
      viewFns: Array<CodecType<typeof viewFunction>>
      index: number
      docs: string[]
    } & DeprecationInfo<T>
  >
  extrinsic: {
    version: number[]
    extensions: Record<
      string,
      {
        identifier: string
        type: number
        additionalSigned: number
      }
    >
    extensionsByVersion: Record<
      number,
      Array<{
        identifier: string
        type: number
        additionalSigned: number
      }>
    >
  } & (T extends 14
    ? {
        type: number
      }
    : { address: number; call: number; signature: number })
  apis: Array<
    {
      name: string
      methods: Array<
        {
          name: string
          inputs: Array<{ name: string; type: number }>
          output: number
          docs: string[]
        } & DeprecationInfo<T>
      >
      docs: string[]
    } & (T extends 16 ? { version: number } : {}) &
      DeprecationInfo<T>
  >
} & (T extends 14
  ? {}
  : {
      outerEnums: { call: number; event: number; error: number }
      custom: Array<[string, { type: number; value: HexString }]>
    })

export const unifyMetadata = (
  metadata: Metadata | Metadata["metadata"] | V14 | V15 | V16,
): UnifiedMetadata => {
  // complete metadata
  if ("magicNumber" in metadata) metadata = metadata.metadata
  if ("tag" in metadata) {
    if (
      metadata.tag !== "v14" &&
      metadata.tag !== "v15" &&
      metadata.tag !== "v16"
    )
      throw new Error("Only metadata 14, 15, and 16 are supported")
    metadata = metadata.value
  }

  // v16
  if ("signedExtensionsByVersion" in metadata.extrinsic) {
    const {
      extrinsic: {
        signedExtensions,
        signedExtensionsByVersion,
        ...restExtrinsic
      },
      ...rest
    } = metadata as V16
    if (!signedExtensionsByVersion.some(([v]) => v === 0)) {
      throw new Error("Extension version 0 not found")
    }
    return {
      version: 16,
      extrinsic: {
        ...restExtrinsic,
        extensions: Object.fromEntries(
          signedExtensions.map((v) => [v.identifier, v]),
        ),
        extensionsByVersion: Object.fromEntries(
          signedExtensionsByVersion.map(([v, idxs]) => [
            v,
            idxs.map((extIdx) => signedExtensions[extIdx]),
          ]),
        ),
      },
      ...rest,
    }
  }
  // v15
  if ("custom" in metadata) {
    const {
      lookup,
      extrinsic: { signedExtensions, ...restExtrinsic },
      custom,
      apis,
      pallets,
      outerEnums,
    } = metadata as V15

    return {
      version: 15,
      lookup,
      pallets: pallets.map((p): UnifiedMetadata<15>["pallets"][number] => ({
        ...p,
        calls: p.calls != null ? { type: p.calls } : undefined,
        events: p.events != null ? { type: p.events } : undefined,
        errors: p.errors != null ? { type: p.errors } : undefined,
        viewFns: [],
        associatedTypes: [],
      })),
      extrinsic: {
        ...restExtrinsic,
        extensions: Object.fromEntries(
          signedExtensions.map((v) => [v.identifier, v]),
        ),
        extensionsByVersion: { 0: signedExtensions },
        version: [restExtrinsic.version],
      },
      apis,
      outerEnums,
      custom,
    }
  }
  // fallback, v14
  const {
    lookup,
    extrinsic: { signedExtensions, ...restExtrinsic },
    pallets,
  } = metadata as V14
  return {
    version: 14,
    lookup,
    pallets: pallets.map((p): UnifiedMetadata<14>["pallets"][number] => ({
      ...p,
      calls: p.calls != null ? { type: p.calls } : undefined,
      events: p.events != null ? { type: p.events } : undefined,
      errors: p.errors != null ? { type: p.errors } : undefined,
      viewFns: [],
      associatedTypes: [],
    })),
    extrinsic: {
      ...restExtrinsic,
      extensions: Object.fromEntries(
        signedExtensions.map((v) => [v.identifier, v]),
      ),
      extensionsByVersion: { 0: signedExtensions },
      version: [restExtrinsic.version],
    },
    apis: [],
  }
}
