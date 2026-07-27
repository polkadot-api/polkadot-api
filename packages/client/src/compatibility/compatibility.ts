import { ChainDefinition } from "@/descriptors"
import { createProxyPath } from "@/utils"
import { withWeakCache } from "@/utils/with-weak-cache"
import {
  CompatibilityCache,
  CompatibilityLevel,
  EntryPoint,
  entryPointsAreCompatible,
  IncompatibleResult,
  IsCompatibleResult,
  TypedefNode,
  valueIsCompatibleWithDest,
} from "@polkadot-api/metadata-compatibility"
import { RuntimeContext } from "@polkadot-api/observable-client"
import { Enum } from "@polkadot-api/substrate-bindings"
import {
  CompatCtx,
  getDestCompatCtx,
  getEntryAndGetter,
  getUserCompatCtx,
  OpType,
} from "./compat-ctx"

export type CompatApi<T> = Promise<(ctx: RuntimeContext) => T>
export type ValueCompatibility = Enum<{
  compatible: undefined
  runtimeIncompatible: undefined
  incompatible: IncompatibleResult
}>
const mapCompatibleResult = (result: IsCompatibleResult): ValueCompatibility =>
  result.compatible ? Enum("compatible") : Enum("incompatible", result)
export type CompatHelper<T = any> = {
  level: CompatibilityLevel
  isCompatible: (from?: CompatibilityLevel) => boolean
  getValueCompatibility: (dest: T) => ValueCompatibility
}
export type ArgsValueCompatHelper<Args = any, Value = any> = {
  args: CompatHelper<Args>
  value: CompatHelper<Value>
  isCompatible: (from?: CompatibilityLevel) => boolean
}
export type ValueCompat = CompatApi<CompatHelper>
export type InOutCompat = CompatApi<ArgsValueCompatHelper>
export type ConstCompat = Promise<(dest: any) => boolean>

const incompatible: CompatHelper = {
  level: CompatibilityLevel.Incompatible,
  isCompatible: () => false,
  getValueCompatibility: () => Enum("runtimeIncompatible"),
}
const inOutIncompat: ArgsValueCompatHelper = {
  args: incompatible,
  value: incompatible,
  isCompatible: () => false,
}

const identical: CompatHelper = {
  level: CompatibilityLevel.Identical,
  isCompatible: () => true,
  // This will only be used on values returned from the node, so we can assume it will be compatible without checks
  getValueCompatibility: () => Enum("compatible"),
}

const getIsApiCompatible =
  (currentLevel: CompatibilityLevel) =>
  (target = CompatibilityLevel.BackwardsCompatible) =>
    currentLevel >= target

const getCompatibilityHelper = <K extends OpType>(
  kind: OpType,
  cache: CompatibilityCache,
  user: {
    entry?: EntryPoint
    getter: (id: number) => TypedefNode
  } | null,
  dest: {
    entry?: EntryPoint
    getter: (id: number) => TypedefNode
  },
): K extends OpType.Tx | OpType.Event | OpType.Const
  ? CompatHelper
  : ArgsValueCompatHelper => {
  let result: { args: CompatHelper; value: CompatHelper }

  if (!dest.entry) result = inOutIncompat
  else {
    const { args } = dest.entry

    const _getCompat = (value: any) =>
      mapCompatibleResult(valueIsCompatibleWithDest(args, dest.getter, value))
    const getValueCompatibility =
      kind === OpType.Storage
        ? (value: any[]) => _getCompat(value.length === 1 ? value[0] : value)
        : _getCompat

    if (!user?.entry) {
      const level = CompatibilityLevel.Partial
      result = {
        args: {
          level,
          getValueCompatibility,
          isCompatible: getIsApiCompatible(level),
        },
        value: user ? incompatible : identical,
      }
    } else {
      const { values: userValues } = user.entry

      const { args, values } = entryPointsAreCompatible(
        user.entry,
        user.getter,
        dest.entry,
        dest.getter,
        cache,
      )

      result = {
        args: {
          level: args.level,
          getValueCompatibility,
          isCompatible: getIsApiCompatible(args.level),
        },
        value:
          values.level === CompatibilityLevel.Incompatible
            ? incompatible
            : {
                level: values.level,
                getValueCompatibility:
                  values.level > CompatibilityLevel.Partial
                    ? () => Enum("compatible")
                    : (val) =>
                        mapCompatibleResult(
                          valueIsCompatibleWithDest(
                            userValues,
                            user.getter,
                            val,
                          ),
                        ),
                isCompatible: getIsApiCompatible(values.level),
              },
      }
    }
  }

  if (kind === OpType.Storage || kind === OpType.Api || kind === OpType.ViewFns)
    return Object.assign(result, {
      isCompatible: getIsApiCompatible(
        Math.min(result.args.level, result.value.level),
      ),
    }) as any

  return (kind === OpType.Tx ? result.args : result.value) as any
}

export const createCompatHelpers = withWeakCache(
  (descriptors?: ChainDefinition) => {
    let userCtx: CompatCtx | null = null
    const awaitedUserCtx: Promise<CompatCtx | null> = (
      descriptors ? getUserCompatCtx(descriptors) : Promise.resolve(null)
    ).then((x) => (userCtx = x))

    // before calling this function we must await on `awaitedUserCtx`
    const getHelpers = withWeakCache((runtimeCtx: RuntimeContext) => {
      const cache = new Map()
      const destCtx = getDestCompatCtx(runtimeCtx)
      const getCompat = <K extends OpType>(kind: K) =>
        createProxyPath(
          (
            group: string,
            name: string,
          ): K extends OpType.Tx | OpType.Event | OpType.Const
            ? CompatHelper
            : ArgsValueCompatHelper =>
            getCompatibilityHelper(
              kind,
              cache,
              getEntryAndGetter(userCtx, kind, group, name),
              getEntryAndGetter(destCtx, kind, group, name),
            ),
        )

      return {
        tx: getCompat(OpType.Tx),
        constants: getCompat(OpType.Const),
        apis: getCompat(OpType.Api),
        view: getCompat(OpType.ViewFns),
        query: getCompat(OpType.Storage),
        event: getCompat(OpType.Event),
      }
    })

    const getClientCompat = async <
      K extends "tx" | "constants" | "apis" | "view" | "query" | "event",
    >(
      kind: K,
      group: string,
      name: string,
    ): CompatApi<
      K extends "tx" | "event" | "constants"
        ? CompatHelper
        : ArgsValueCompatHelper
    > => {
      await awaitedUserCtx
      return (ctx: RuntimeContext) => getHelpers(ctx)[kind][group][name] as any
    }

    return {
      getSyncHelpers: async (ctx: RuntimeContext) => {
        await awaitedUserCtx
        return getHelpers(ctx)
      },
      getClientCompat,
      getIsAsssetCompat: (ctx: RuntimeContext) =>
        getDestCompatCtx(ctx).isAssetCompat,
    }
  },
)

export type CompatHelpers = ReturnType<typeof createCompatHelpers>

export class InvalidArgsError extends Error {
  constructor(
    public callType: "Storage" | "RuntimeCall" | "Transaction" | "ViewFn",
    public callEntry: string,
    public callArgs: unknown[],
    public incompatibleResult: Pick<IncompatibleResult, "path" | "reason">,
  ) {
    super(`Invalid arguments calling ${callType} ${callEntry}(${callArgs})`)
  }
}

export class IncompatibleRuntimeError extends Error {
  constructor(
    public callType:
      | "Storage"
      | "RuntimeCall"
      | "Transaction"
      | "ViewFn"
      | "Constant"
      | "Event",
    public callEntry: string,
  ) {
    super(`Incompatible runtime ${callType} entry ${callEntry}`)
  }
}
