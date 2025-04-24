import {
  firstValueFromWithSignal,
  isOptionalArg,
  lossLessExhaustMap,
} from "@/utils"
import { CompatibilityLevel } from "@polkadot-api/metadata-compatibility"
import {
  BlockInfo,
  BlockNotPinnedError,
  ChainHead$,
  RuntimeContext,
} from "@polkadot-api/observable-client"
import { FixedSizeBinary } from "@polkadot-api/substrate-bindings"
import { StorageItemInput, StorageResult } from "@polkadot-api/substrate-client"
import {
  Observable,
  OperatorFunction,
  combineLatestWith,
  distinctUntilChanged,
  filter,
  from,
  identity,
  map,
  mergeMap,
  pipe,
  shareReplay,
  take,
} from "rxjs"
import {
  CompatibilityFunctions,
  CompatibilityHelper,
  minCompatLevel,
} from "./compatibility"
import { createWatchEntries } from "./watch-entries"

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

type WithWatchOptions<Args extends Array<any>> = [
  ...args: Args,
  options?: { at: "best" },
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

type StorageEntryWithoutKeys<Unsafe, D, Payload> = {
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
} & (Unsafe extends true ? {} : CompatibilityFunctions<D>)

export type StorageEntryWithKeys<
  Unsafe,
  D,
  Args extends Array<any>,
  Payload,
  ArgsOut extends Array<any>,
> = {
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
  ) => Promise<Array<{ keyArgs: ArgsOut; value: NonNullable<Payload> }>>
  /**
   * Watch changes (Observable-based) for the storage entries with a subset of
   * `Args`.
   *
   * @param args  Subset of keys needed for the storage entry.
   *              At the end, optionally set whether to watch against the
   *              `best` block.
   *              By default watches changes against the finalized block.
   *              When watching changes against the "best" block, this API
   *              gratiously handles the re-orgs and provides the deltas
   *              based on the latest emission.
   *              The observed value contains the following properties:
   *              - `block`: the block in where the `deltas` took place -
   *              `deltas`: `null` indicates that nothing has changed from
   *              the latest emission.
   *              If the value is not `null` then the `deleted` and `upsrted`
   *              properties indicate the entries that have changed.
   *              - `entries`: it's an immutable data-structure with the
   *              latest entries.
   * @example
   *
   *   typedApi.query.Staking.Nominators.watchEntries()
   *   typedApi.query.Staking.Nominators.watchEntries({ at: "best" })
   *
   */
  watchEntries: (
    ...args: WithWatchOptions<PossibleParents<Args>>
  ) => Observable<{
    block: BlockInfo
    deltas: null | {
      deleted: Array<{ args: ArgsOut; value: NonNullable<Payload> }>
      upserted: Array<{ args: ArgsOut; value: NonNullable<Payload> }>
    }
    entries: Array<{ args: ArgsOut; value: NonNullable<Payload> }>
  }>
} & (Unsafe extends true ? {} : CompatibilityFunctions<D>)

export type StorageEntry<
  Unsafe,
  D,
  Args extends Array<any>,
  ArgsOut extends Array<any>,
  Payload,
> = Args extends []
  ? StorageEntryWithoutKeys<Unsafe, D, Payload>
  : StorageEntryWithKeys<Unsafe, D, Args, Payload, ArgsOut>

export type Storage$ = <Type extends StorageItemInput["type"]>(
  hash: string | null,
  type: Type,
  key: string,
  childTrie: string | null,
) => Observable<StorageResult<Type>>

const toMapped = map(<T>(x: { mapped: T }) => x.mapped)
export const createStorageEntry = (
  pallet: string,
  name: string,
  chainHead: ChainHead$,
  getWatchEntries: ReturnType<typeof createWatchEntries>,
  {
    isCompatible,
    getCompatibilityLevel,
    getCompatibilityLevels,
    descriptors: descriptorsPromise,
    argsAreCompatible,
    valuesAreCompatible,
  }: CompatibilityHelper,
): StorageEntry<any, any, any, any, any> => {
  const isSystemNumber = pallet === "System" && name === "Number"
  const isBlockHash = pallet === "System" && name === "BlockHash"
  const sysNumberMapper$ = chainHead.runtime$.pipe(
    filter(Boolean),
    take(1),
    map(({ dynamicBuilder }) =>
      typeof dynamicBuilder
        .buildStorage("System", "Number")
        .value.dec(new Uint8Array(32)) === "bigint"
        ? BigInt
        : identity,
    ),
    shareReplay(),
  )
  const bigIntOrNumber: OperatorFunction<number, number | bigint> = pipe(
    combineLatestWith(sysNumberMapper$),
    map(([input, mapper]) => mapper(input)),
  )

  const incompatibleError = () =>
    new Error(`Incompatible runtime entry Storage(${pallet}.${name})`)
  const invalidArgs = (args: Array<any>) =>
    new Error(`Invalid Arguments calling ${pallet}.${name}(${args})`)

  const getCodec = (ctx: RuntimeContext) => {
    try {
      return ctx.dynamicBuilder.buildStorage(pallet, name)
    } catch (e: any) {
      throw new Error(`Runtime entry Storage(${pallet}.${name}) not found`)
    }
  }

  const watchValue = (...args: Array<any>) => {
    const target = args[args.length - 1]
    const isBest = target === "best"
    const actualArgs =
      isBest || target === "finalized" ? args.slice(0, -1) : args

    return chainHead[isBest ? "best$" : "finalized$"].pipe(
      lossLessExhaustMap(() =>
        getRawValue$(...actualArgs, isBest ? { at: "best" } : {}),
      ),
      distinctUntilChanged((a, b) => a.raw === b.raw),
      toMapped,
    )
  }

  const getRawValue$ = (...args: Array<any>) => {
    const lastArg = args[args.length - 1]
    const isLastArgOptional = isOptionalArg(lastArg)
    const { at: _at }: CallOptions = isLastArgOptional ? lastArg : {}
    const at = _at ?? null

    if (isSystemNumber)
      return chainHead.pinnedBlocks$.pipe(
        map((blocks) => {
          const hash =
            at === "finalized" || !at
              ? blocks.finalized
              : at === "best"
                ? blocks.best
                : at
          const block = blocks.blocks.get(hash)
          if (!block) {
            throw new BlockNotPinnedError(hash, "System.Number")
          }
          return block.number
        }),
        distinctUntilChanged(),
        bigIntOrNumber,
        map((mapped) => ({ raw: mapped, mapped })),
      )

    if (isBlockHash && Number(args[0]) === 0) {
      return chainHead.genesis$.pipe(
        map((raw) => ({ raw, mapped: FixedSizeBinary.fromHex(raw) })),
      ) as Observable<any>
    }

    return from(descriptorsPromise).pipe(
      mergeMap((descriptors) =>
        chainHead.storage$(
          at,
          "value",
          (ctx) => {
            const codecs = getCodec(ctx)
            const actualArgs =
              args.length === codecs.len ? args : args.slice(0, -1)
            if (args !== actualArgs && !isLastArgOptional)
              throw invalidArgs(args)
            if (!argsAreCompatible(descriptors, ctx, actualArgs))
              throw incompatibleError()
            return codecs.keys.enc(...actualArgs)
          },
          null,
          (data, ctx) => {
            const codecs = getCodec(ctx)
            const value =
              data === null ? codecs.fallback : codecs.value.dec(data)
            if (!valuesAreCompatible(descriptors, ctx, value))
              throw incompatibleError()
            return value
          },
        ),
      ),
    )
  }

  const getValue = async (...args: Array<any>) => {
    const lastArg = args[args.length - 1]
    const isLastArgOptional = isOptionalArg(lastArg)
    const { signal }: CallOptions = isLastArgOptional ? lastArg : {}

    return firstValueFromWithSignal(
      getRawValue$(...args).pipe(toMapped),
      signal,
    )
  }

  const getEntries = async (...args: Array<any>) => {
    const lastArg = args[args.length - 1]
    const isLastArgOptional = isOptionalArg(lastArg)
    const { signal, at: _at }: CallOptions = isLastArgOptional ? lastArg : {}
    const at = _at ?? null

    const descriptors = await descriptorsPromise
    const result$ = chainHead
      .storage$(
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
          return codecs.keys.enc(...actualArgs)
        },
        null,
        (values, ctx) => {
          const codecs = getCodec(ctx)
          const decodedValues = values.map(({ key, value }) => ({
            keyArgs: codecs.keys.dec(key),
            value: codecs.value.dec(value),
          }))
          if (
            decodedValues.some(
              ({ value }) => !valuesAreCompatible(descriptors, ctx, value),
            )
          )
            throw incompatibleError()
          return decodedValues
        },
      )
      .pipe(toMapped)
    return firstValueFromWithSignal(result$, signal)
  }

  const getValues = (keyArgs: Array<Array<any>>, options?: CallOptions) =>
    Promise.all(
      keyArgs.map((args) => getValue(...(options ? [...args, options] : args))),
    )

  const watchEntries: any = (...args: Array<any>) => {
    const lastArg = args.at(-1)
    const isLastArgOptional = isOptionalArg(lastArg)

    return getWatchEntries(
      pallet,
      name,
      isLastArgOptional ? args.slice(0, -1) : args,
      isLastArgOptional && lastArg.at === "best",
    )
  }

  return {
    isCompatible,
    getCompatibilityLevel,
    getValue,
    getValues,
    getEntries,
    watchValue,
    watchEntries,
  }
}
