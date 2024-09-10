import { firstValueFromWithSignal, isOptionalArg, raceMap } from "@/utils"
import {
  ChainHead$,
  NotBestBlockError,
  RuntimeContext,
} from "@polkadot-api/observable-client"
import { StorageItemInput, StorageResult } from "@polkadot-api/substrate-client"
import { Observable, debounceTime, distinctUntilChanged, map } from "rxjs"
import {
  CompatibilityFunctions,
  CompatibilityHelper,
  minCompatLevel,
} from "./compatibility"
import { CompatibilityLevel } from "@polkadot-api/metadata-compatibility"

type CallOptions = Partial<{
  /**
   * `at` could be a blockHash, `best`, or `finalized` (default)
   */
  at: string
  /**
   * `signal` allows you to abort an ongoing Promise. See [MDN
   * docs](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) for
   * more information
   */
  signal: AbortSignal
}>

type WithCallOptions<Args extends Array<any>> = [
  ...args: Args,
  options?: CallOptions,
]

type PossibleParents<A extends Array<any>> = A extends [...infer Left, any]
  ? Left | PossibleParents<Left>
  : ArrayPossibleParents<A>

// Fixed-size arrays values can't be extracted one-by-one, so that's a specific case
type ArrayPossibleParents<
  A extends Array<any>,
  Count extends Array<any> = [],
  R = [],
> = A extends Array<infer T> & { length: infer L }
  ? number extends L
    ? Array<T> // Case variable-size array it's an unknown amount of entries
    : L extends Count["length"]
      ? R
      : ArrayPossibleParents<A, [...Count, T], R | Count>
  : never

type StorageEntryWithoutKeys<D, Payload> = {
  /**
   * Get `Payload` (Promise-based) for the storage entry.
   *
   * @param options  Optionally set which block to target (latest known
   *                 finalized is the default) and an AbortSignal.
   */
  getValue: (options?: CallOptions) => Promise<Payload>
  /**
   * Watch changes in `Payload` (observable-based) for the storage entry.
   *
   * @param bestOrFinalized  Optionally choose which block to query and watch
   *                         changes, `best` or `finalized` (default)
   */
  watchValue: (bestOrFinalized?: "best" | "finalized") => Observable<Payload>
} & CompatibilityFunctions<D>

type StorageEntryWithKeys<D, Args extends Array<any>, Payload> = {
  /**
   * Get `Payload` (Promise-based) for the storage entry with a specific set of
   * `Args`.
   *
   * @param args  All keys needed for that storage entry.
   *              At the end, optionally set which block to target (latest
   *              known finalized is the default) and an AbortSignal.
   */
  getValue: (...args: [...WithCallOptions<Args>]) => Promise<Payload>
  /**
   * Watch changes in `Payload` (observable-based) for the storage entry.
   *
   * @param args  All keys needed for that storage entry.
   *              At the end, optionally choose which block to query and
   *              watch changes, `best` or `finalized` (default)
   */
  watchValue: (
    ...args: [...Args, bestOrFinalized?: "best" | "finalized"]
  ) => Observable<Payload>
  /**
   * Get an Array of `Payload` (Promise-based) for the storage entry with
   * several sets of `Args`.
   *
   * @param keys     Array of sets of keys needed for the storage entry.
   * @param options  Optionally set which block to target (latest known
   *                 finalized is the default) and an AbortSignal.
   */
  getValues: (
    keys: Array<[...Args]>,
    options?: CallOptions,
  ) => Promise<Array<Payload>>
  /**
   * Get an Array of `Payload` (Promise-based) for the storage entry with a
   * subset of `Args`.
   *
   * @param args  Subset of keys needed for the storage entry.
   *              At the end, optionally set which block to target (latest
   *              known finalized is the default) and an AbortSignal.
   * @example
   *
   *   // this is a query with 3 keys
   *   typedApi.query.Pallet.Query.getEntries({ at: "best" }) // no keys
   *   typedApi.query.Pallet.Query.getEntries(arg1, { at: "finalized" }) // 1/3 keys
   *   typedApi.query.Pallet.Query.getEntries(arg1, arg2, { at: "0x12345678" }) // 2/3 keys
   *
   */
  getEntries: (
    ...args: WithCallOptions<PossibleParents<Args>>
  ) => Promise<Array<{ keyArgs: Args; value: NonNullable<Payload> }>>
} & CompatibilityFunctions<D>

export type StorageEntry<D, Args extends Array<any>, Payload> = Args extends []
  ? StorageEntryWithoutKeys<D, Payload>
  : StorageEntryWithKeys<D, Args, Payload>

export type Storage$ = <Type extends StorageItemInput["type"]>(
  hash: string | null,
  type: Type,
  key: string,
  childTrie: string | null,
) => Observable<StorageResult<Type>>

export const createStorageEntry = (
  pallet: string,
  name: string,
  chainHead: ChainHead$,
  {
    isCompatible,
    getCompatibilityLevel,
    getCompatibilityLevels,
    waitDescriptors,
    withCompatibleRuntime,
    argsAreCompatible,
    valuesAreCompatible,
  }: CompatibilityHelper,
): StorageEntry<any, any, any> => {
  const isSystemNumber = pallet === "System" && name === "Number"

  const incompatibleError = () =>
    new Error(`Incompatible runtime entry Storage(${pallet}.${name})`)
  const invalidArgs = (args: Array<any>) =>
    new Error(`Invalid Arguments calling ${pallet}.${name}(${args})`)

  const getCodec = (ctx: RuntimeContext) => {
    try {
      return ctx.dynamicBuilder.buildStorage(pallet, name)
    } catch {
      throw new Error(`Runtime entry Storage(${pallet}.${name}) not found`)
    }
  }

  const watchValue = (...args: Array<any>) => {
    const target = args[args.length - 1]
    const actualArgs =
      target === "best" || target === "finalized" ? args.slice(0, -1) : args

    if (isSystemNumber)
      return chainHead.bestBlocks$.pipe(
        map((blocks) => blocks.at(target === "best" ? 0 : -1)!.number),
        distinctUntilChanged(),
      )

    return chainHead[target === "best" ? "best$" : "finalized$"].pipe(
      debounceTime(0),
      withCompatibleRuntime(chainHead, (x) => x.hash),
      raceMap(([block, runtime, ctx]) => {
        const codecs = getCodec(ctx)
        if (!argsAreCompatible(runtime, ctx, actualArgs))
          throw incompatibleError()
        return chainHead
          .storage$(block.hash, "value", () => codecs.enc(...actualArgs))
          .pipe(
            map((val) => {
              if (!valuesAreCompatible(runtime, ctx, val))
                throw incompatibleError()
              return { val, codecs }
            }),
          )
      }, 4),
      distinctUntilChanged((a, b) => a.val === b.val),
      map(({ val, codecs }) =>
        val === null ? codecs.fallback : codecs.dec(val),
      ),
    )
  }

  const getValue = async (...args: Array<any>) => {
    const lastArg = args[args.length - 1]
    const isLastArgOptional = isOptionalArg(lastArg)
    const { signal, at: _at }: CallOptions = isLastArgOptional ? lastArg : {}
    const at = _at ?? null

    let result$: Observable<any>
    if (isSystemNumber) {
      result$ = chainHead.bestBlocks$.pipe(
        map((blocks) => {
          if (at === "finalized" || !at) return blocks.at(-1)
          if (at === "best") return blocks.at(0)
          return blocks.find((block) => block.hash === at)
        }),
        map((block) => {
          if (!block) throw new NotBestBlockError()
          return block.number
        }),
        distinctUntilChanged(),
      )
    } else {
      const descriptors = await waitDescriptors()
      result$ = chainHead.storage$(
        at,
        "value",
        (ctx) => {
          const codecs = getCodec(ctx)
          const actualArgs =
            args.length === codecs.len ? args : args.slice(0, -1)
          if (args !== actualArgs && !isLastArgOptional) throw invalidArgs(args)
          if (!argsAreCompatible(descriptors, ctx, actualArgs))
            throw incompatibleError()
          return codecs.enc(...actualArgs)
        },
        null,
        (data, ctx) => {
          const codecs = getCodec(ctx)
          const value = data === null ? codecs.fallback : codecs.dec(data)
          if (!valuesAreCompatible(descriptors, ctx, value))
            throw incompatibleError()
          return value
        },
      )
    }

    return firstValueFromWithSignal(result$, signal)
  }

  const getEntries = async (...args: Array<any>) => {
    const lastArg = args[args.length - 1]
    const isLastArgOptional = isOptionalArg(lastArg)
    const { signal, at: _at }: CallOptions = isLastArgOptional ? lastArg : {}
    const at = _at ?? null

    const descriptors = await waitDescriptors()
    const result$ = chainHead.storage$(
      at,
      "descendantsValues",
      (ctx) => {
        const codecs = getCodec(ctx)
        // TODO partial compatibility check for args that become optional
        if (
          minCompatLevel(getCompatibilityLevels(descriptors, ctx)) ===
          CompatibilityLevel.Incompatible
        )
          throw incompatibleError()

        if (args.length > codecs.len) throw invalidArgs(args)
        const actualArgs =
          args.length > 0 && isLastArgOptional ? args.slice(0, -1) : args
        if (args.length === codecs.len && actualArgs === args)
          throw invalidArgs(args)
        return codecs.enc(...actualArgs)
      },
      null,
      (values, ctx) => {
        const codecs = getCodec(ctx)
        if (
          values.some(
            ({ value }) => !valuesAreCompatible(descriptors, ctx, value),
          )
        )
          throw incompatibleError()
        return values.map(({ key, value }) => ({
          keyArgs: codecs.keyDecoder(key),
          value: codecs.dec(value),
        }))
      },
    )
    return firstValueFromWithSignal(result$, signal)
  }

  const getValues = (keyArgs: Array<Array<any>>, options?: CallOptions) =>
    Promise.all(
      keyArgs.map((args) => getValue(...(options ? [...args, options] : args))),
    )

  return {
    isCompatible,
    getCompatibilityLevel,
    getValue,
    getValues,
    getEntries,
    watchValue,
  }
}
