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
import { FixedSizeBinary, HexString } from "@polkadot-api/substrate-bindings"
import { StorageItemInput, StorageResult } from "@polkadot-api/substrate-client"
import {
  Observable,
  catchError,
  combineLatest,
  combineLatestWith,
  distinctUntilChanged,
  filter,
  firstValueFrom,
  from,
  identity,
  map,
  mergeMap,
  shareReplay,
  take,
} from "rxjs"
import { InOutCompat } from "./compatibility"
import { PullOptions } from "./types"
import { stgGetKey } from "./utils/stg-get-key"
import { createWatchEntries } from "./watch-entries"

type WithCallOptions<Args extends Array<any>> = [
  ...args: Args,
  options?: PullOptions,
]

type WithWatchOptions<Args extends Array<any>> = [
  ...args: Args,
  options?: { at: "best" },
]

type PossibleParents<A extends Array<any>> = A extends [...infer Left, any]
  ? Left | PossibleParents<Left>
  : ArrayPossibleParents<A>

type AllPermutations<A extends Array<any>> = PossibleParents<A> | A

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

type GetKey<Args extends Array<any>> = {
  /**
   * Get the storage-key for this storage entry.
   *
   * @param args  All keys needed for that storage entry.
   * @returns Promise that will resolve the hexadecimal value of the
   *          storage key.
   */
  (...args: AllPermutations<Args>): Promise<HexString>
}

type StorageEntryWithoutKeys<Payload> = {
  /**
   * Get `Payload` (Promise-based) for the storage entry.
   *
   * @param options  Optionally set which block to target (latest known
   *                 finalized is the default) and an AbortSignal.
   */
  getValue: (options?: PullOptions) => Promise<Payload>
  /**
   * Watch changes in `Payload` (observable-based) for the storage entry.
   *
   * @param options  Optionally choose which block to watch changes, `best`
   *                 or `finalized` (default)
   */
  watchValue: (options?: { at: "best" | "finalized" }) => Observable<{
    block: BlockInfo
    value: Payload
  }>
  getKey: GetKey<[]>
}

export type StorageEntryWithKeys<
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
   *              At the end, optionally choose which block to watch changes,
   *              `best` or `finalized` (default).
   */
  watchValue: (
    ...args: [...Args, options?: { at: "best" | "finalized" }]
  ) => Observable<{
    block: BlockInfo
    value: Payload
  }>
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
    options?: PullOptions,
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
   *              At the end, optionally choose which block to watch changes,
   *              `best` or `finalized` (default)
   *              By default watches changes against the finalized block.
   *              When watching changes against the "best" block, this API
   *              gratiously handles the re-orgs and provides the deltas
   *              based on the latest emission.
   *              The observed value contains the following properties:
   *              - `block`: the block in where the `deltas` took place -
   *              `deltas`: `null` indicates that nothing has changed from
   *              the latest emission.
   *              If the value is not `null` then the `deleted` and
   *              `upserted`
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

  getKey: GetKey<Args>
}

export type StorageEntry<
  Args extends Array<any>,
  ArgsOut extends Array<any>,
  Payload,
> = Args extends []
  ? StorageEntryWithoutKeys<Payload>
  : StorageEntryWithKeys<Args, Payload, ArgsOut>

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
  getWatchEntries: ReturnType<typeof createWatchEntries>,
  compatibility: InOutCompat,
): StorageEntry<any, any, any> => {
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
    const lastArg = args.at(-1)
    const isLastArgOptional = isOptionalArg(lastArg)

    const [actualArgs, isBest] = isLastArgOptional
      ? ([args.slice(0, -1), args.at(-1).at === "best"] as const)
      : ([args, false] as const)

    return chainHead[isBest ? "best$" : "finalized$"].pipe(
      lossLessExhaustMap(() =>
        getRawValue$(...actualArgs, isBest ? { at: "best" } : {}),
      ),
      distinctUntilChanged((a, b) => a.value.raw === b.value.raw),
      map(({ block, value }) => ({ block, value: value.mapped })),
    )
  }

  const getRawValue$ = (
    ...args: Array<any>
  ): Observable<{
    value: { raw: string | null; mapped: any }
    block: BlockInfo
  }> => {
    const lastArg = args[args.length - 1]
    const isLastArgOptional = isOptionalArg(lastArg)
    const { at: _at }: PullOptions = isLastArgOptional ? lastArg : {}
    const at = _at ?? null

    const result$ = from(compatibility).pipe(
      mergeMap((getCompatibility) =>
        chainHead.storage$(
          at,
          "value",
          (ctx) => {
            const codecs = getCodec(ctx)
            const compat = getCompatibility(ctx)
            const actualArgs =
              args.length === codecs.len ? args : args.slice(0, -1)
            if (args !== actualArgs && !isLastArgOptional)
              throw invalidArgs(args)

            if (!compat.args.isValueCompatible(actualArgs))
              throw incompatibleError()

            return codecs.keys.enc(...actualArgs)
          },
          null,
          (data, ctx) => {
            const codecs = getCodec(ctx)
            const {
              value: { isValueCompatible: isCompat },
            } = getCompatibility(ctx)
            const mapped =
              data === null ? codecs.fallback : codecs.value.dec(data)
            if (!isCompat(mapped)) throw incompatibleError()
            return { raw: data, mapped }
          },
        ),
      ),
      chainHead.withHodl(at),
    )

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
          return block
        }),
        distinctUntilChanged((a, b) => a.number === b.number),
        combineLatestWith(sysNumberMapper$),
        map(([block, mapper]) => ({
          block,
          value: { raw: block.number.toString(), mapped: mapper(block.number) },
        })),
        catchError((e) => {
          if (e instanceof BlockNotPinnedError) return result$
          throw e
        }),
      )

    return isBlockHash && Number(args[0]) === 0
      ? chainHead.genesis$.pipe(
          map((raw) => ({
            block: {
              hash: raw,
              parent: "0x" + new Array(raw.length - 2).fill(0).join(""),
              hasNewRuntime: true,
              number: 0,
            },
            value: { raw, mapped: FixedSizeBinary.fromHex(raw) },
          })),
        )
      : result$
  }

  const getValue = async (...args: Array<any>) => {
    const lastArg = args[args.length - 1]
    const isLastArgOptional = isOptionalArg(lastArg)
    const { signal }: PullOptions = isLastArgOptional ? lastArg : {}

    return firstValueFromWithSignal(
      getRawValue$(...args).pipe(map((v) => v.value.mapped)),
      signal,
    )
  }

  const getEntries = async (...args: Array<any>) => {
    const lastArg = args[args.length - 1]
    const isLastArgOptional = isOptionalArg(lastArg)
    const { signal, at: _at }: PullOptions = isLastArgOptional ? lastArg : {}
    const at = _at ?? null

    const result$ = from(compatibility).pipe(
      mergeMap((getCompatibility) =>
        chainHead.storage$(
          at,
          "descendantsValues",
          (ctx) => {
            const compat = getCompatibility(ctx)
            const codecs = getCodec(ctx)
            if (!compat.isCompatible(CompatibilityLevel.Partial))
              throw incompatibleError()

            if (args.length > codecs.len) throw invalidArgs(args)
            const actualArgs =
              args.length > 0 && isLastArgOptional ? args.slice(0, -1) : args
            if (args.length === codecs.len && actualArgs === args)
              throw invalidArgs(args)

            // TODO: check for partial args
            // if (!compat.args.isValueCompatible(args)) throw incompatibleError

            return codecs.keys.enc(...actualArgs)
          },
          null,
          (values, ctx) => {
            const codecs = getCodec(ctx)
            const compat = getCompatibility(ctx)
            const decodedValues = values.map(({ key, value }) => ({
              keyArgs: codecs.keys.dec(key),
              value: codecs.value.dec(value),
            }))
            // TODO: check args compatibility with user
            if (
              compat.value.level === CompatibilityLevel.Partial &&
              decodedValues.some(
                ({ value }) => !compat.value.isValueCompatible(value),
              )
            )
              throw incompatibleError()
            return decodedValues
          },
        ),
      ),
      map((v) => v.value),
      chainHead.withHodl(at),
    )
    return firstValueFromWithSignal(result$, signal)
  }

  const getValues = (keyArgs: Array<Array<any>>, options?: PullOptions) =>
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

  const getKey = (...args: Array<any>): Promise<string> =>
    firstValueFrom(
      combineLatest([chainHead.getRuntimeContext$(null), compatibility]).pipe(
        map(([ctx, getCompat]) =>
          stgGetKey(
            ctx,
            pallet,
            name,
            getCompat(ctx).args.isValueCompatible,
          )(...args),
        ),
      ),
    )

  return {
    getKey: getKey as GetKey<any>,
    getValue,
    getValues,
    getEntries,
    watchValue,
    watchEntries,
  }
}
