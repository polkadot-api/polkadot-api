import { RuntimeContext } from "@polkadot-api/observable-client"
import {
  CompatibilityCache,
  CompatibilityLevel,
  EntryPoint,
  entryPointsAreCompatible,
  TypedefNode,
  valueIsCompatibleWithDest,
} from "@polkadot-api/metadata-compatibility"
import { ChainDefinition } from "@/descriptors"
import {
  CompatCtx,
  getDestCompatCtx,
  getEntryAndGetter,
  getUserCompatCtx,
  OpType,
} from "./compat-ctx"
import { createProxyPath } from "@/utils"
import { withWeakCache } from "@/utils/with-weak-cache"

export type CompatApi<T> = Promise<(ctx: RuntimeContext) => T>
export type CompatHelper<T = any> = {
  level: CompatibilityLevel
  isCompatible: (from?: CompatibilityLevel) => boolean
  isValueCompatible: (dest: T) => boolean
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
  isValueCompatible: () => false,
}
const inOutIncompat: ArgsValueCompatHelper = {
  args: incompatible,
  value: incompatible,
  isCompatible: () => false,
}

const identical: CompatHelper = {
  level: CompatibilityLevel.Identical,
  isCompatible: () => true,
  isValueCompatible: () => true,
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

    const _isCompat = (value: any) =>
      valueIsCompatibleWithDest(args, dest.getter, value)
    const isValueCompatible =
      kind === OpType.Storage
        ? (value: any[]) => _isCompat(value.length === 1 ? value[0] : value)
        : _isCompat

    if (!user?.entry) {
      const level = CompatibilityLevel.Partial
      result = {
        args: {
          level,
          isValueCompatible,
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
          isValueCompatible,
          isCompatible: getIsApiCompatible(args.level),
        },
        value:
          values.level === CompatibilityLevel.Incompatible
            ? incompatible
            : {
                level: values.level,
                isValueCompatible:
                  values.level > CompatibilityLevel.Partial
                    ? () => true
                    : (val) =>
                        valueIsCompatibleWithDest(userValues, user.getter, val),
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
        const: getCompat(OpType.Const),
        api: getCompat(OpType.Api),
        view: getCompat(OpType.ViewFns),
        query: getCompat(OpType.Storage),
        event: getCompat(OpType.Event),
      }
    })

    const getClientCompat = async <
      K extends "tx" | "const" | "api" | "view" | "query" | "event",
    >(
      kind: K,
      group: string,
      name: string,
    ): CompatApi<
      K extends "tx" | "event" | "const" ? CompatHelper : ArgsValueCompatHelper
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

export type CompatSyncHelpers = ReturnType<
  typeof createCompatHelpers
>["getSyncHelpers"]
