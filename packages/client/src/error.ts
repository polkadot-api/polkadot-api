import { MetadataLookup } from "@polkadot-api/metadata-builders"
import {
  EntryPoint,
  singleValueEntryPoint,
  voidEntryPointNode,
} from "@polkadot-api/metadata-compatibility"
import { RuntimeContext } from "@polkadot-api/observable-client"
import {
  Bytes,
  FixedSizeBinary,
  Struct,
  u8,
} from "@polkadot-api/substrate-bindings"
import {
  CompatibilityFunctions,
  CompatibilityHelper,
  CompatibilityToken,
  getCompatibilityApi,
} from "./compatibility"
import { ChainDefinition, PlainDescriptor } from "./descriptors"
import { GenericDispatchError } from "./tx"

type ReplaceModule<D extends ChainDefinition> =
  | Exclude<
      D["dispatchError"] extends PlainDescriptor<infer R> ? R : unknown,
      { type: "Module" }
    >
  | {
      type: "Module"
      value: D["moduleError"]
    }

export interface ErrorApi<D extends ChainDefinition>
  extends CompatibilityFunctions<D> {
  decodeDispatchError(
    dispatchError: GenericDispatchError,
  ): Promise<ReplaceModule<D>>
  decodeDispatchError(
    dispatchError: GenericDispatchError,
    compatibilityToken: CompatibilityToken<D>,
  ): ReplaceModule<D>
}

export function createErrorApi<D extends ChainDefinition>({
  getCompatibilityLevel,
  isCompatible,
  waitDescriptors,
}: CompatibilityHelper): ErrorApi<D> {
  const decodeDispatchError = (
    dispatchError: GenericDispatchError,
    compatibilityToken?: CompatibilityToken,
  ): any => {
    if (dispatchError.type !== "Module") {
      return dispatchError
    }
    const moduleError = dispatchError.value as {
      index: number
      error: FixedSizeBinary<number>
    }
    if (compatibilityToken) {
      const ctx = getCompatibilityApi(compatibilityToken).runtime()
      const errorCodec = ctx.dynamicBuilder.buildOuterEnum("error")

      const bytes = moduleError.error.asBytes()
      const ModuleErrorCodec = Struct({
        index: u8,
        error: Bytes(bytes.length),
      })
      const encoded = ModuleErrorCodec.enc({
        index: moduleError.index,
        error: bytes,
      })
      const decoded = errorCodec.dec(encoded)

      return {
        type: "Module",
        value: decoded,
      }
    }
    return waitDescriptors().then((d) => decodeDispatchError(dispatchError, d))
  }

  return {
    getCompatibilityLevel,
    isCompatible,
    decodeDispatchError,
  }
}

export function getDispatchErrorEntryPoint(ctx: RuntimeContext): EntryPoint {
  const id = getDispatchErrorId(ctx.lookup)
  return id == null
    ? {
        args: voidEntryPointNode,
        values: voidEntryPointNode,
      }
    : singleValueEntryPoint(id)
}

function getDispatchErrorId(lookup: MetadataLookup) {
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
