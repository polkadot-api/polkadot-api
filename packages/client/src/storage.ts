import { firstValueFromWithSignal, raceMap } from "@/utils"
import { StorageItemInput, StorageResult } from "@polkadot-api/substrate-client"
import { Observable, debounceTime, distinctUntilChanged, map } from "rxjs"
import { ChainHead$, NotBestBlockError } from "@polkadot-api/observable-client"
import { CompatibilityHelper, IsCompatible } from "./runtime"

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
  : []

type StorageEntryWithoutKeys<Payload> = {
  /**
   * `isCompatible` enables you to check whether or not the call you're trying
   * to make is compatible with the descriptors you generated on dev time.
   * In this case the function waits for `Runtime` to load, and returns
   * asynchronously.
   */
  isCompatible: IsCompatible
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
}

type StorageEntryWithKeys<Args extends Array<any>, Payload> = {
  /**
   * `isCompatible` enables you to check whether or not the call you're trying
   * to make is compatible with the descriptors you generated on dev time.
   * In this case the function waits for `Runtime` to load, and returns
   * asynchronously.
   */
  isCompatible: IsCompatible
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
}

export type StorageEntry<Args extends Array<any>, Payload> = Args extends []
  ? StorageEntryWithoutKeys<Payload>
  : StorageEntryWithKeys<Args, Payload>

export type Storage$ = <Type extends StorageItemInput["type"]>(
  hash: string | null,
  type: Type,
  key: string,
  childTrie: string | null,
) => Observable<StorageResult<Type>>

const isOptionalArg = (lastArg: any) => {
  if (typeof lastArg !== "object") return false

  return Object.keys(lastArg).every(
    (k) =>
      (k === "at" && typeof lastArg.at === "string") ||
      (k === "signal" && lastArg.signal instanceof AbortSignal),
  )
}

export const createStorageEntry = (
  pallet: string,
  name: string,
  chainHead: ChainHead$,
  compatibilityHelper: CompatibilityHelper,
): StorageEntry<any, any> => {
  const isSystemNumber = pallet === "System" && name === "Number"
  const { isCompatible, waitChecksums, withCompatibleRuntime } =
    compatibilityHelper((ctx) => ctx.checksumBuilder.buildStorage(pallet, name))

  const checksumError = () =>
    new Error(`Incompatible runtime entry Storage(${pallet}.${name})`)
  const invalidArgs = (args: Array<any>) =>
    new Error(`Invalid Arguments calling ${pallet}.${name}(${args})`)

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
      withCompatibleRuntime(chainHead, (x) => x.hash, checksumError),
      raceMap(([block, ctx]) => {
        const codecs = ctx.dynamicBuilder.buildStorage(pallet, name)
        return chainHead
          .storage$(block.hash, "value", () => codecs.enc(...actualArgs))
          .pipe(map((val) => ({ val, codecs })))
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
      const isCompatible = await waitChecksums()
      result$ = chainHead.storage$(
        at,
        "value",
        (ctx) => {
          if (!isCompatible(ctx)) throw checksumError()
          const codecs = ctx.dynamicBuilder.buildStorage(pallet, name)
          const actualArgs =
            args.length === codecs.len ? args : args.slice(0, -1)
          if (args !== actualArgs && !isLastArgOptional) throw invalidArgs(args)
          return codecs.enc(...actualArgs)
        },
        null,
        (data, ctx) => {
          const codecs = ctx.dynamicBuilder.buildStorage(pallet, name)
          return data === null ? codecs.fallback : codecs.dec(data)
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

    const isCompatible = await waitChecksums()
    const result$ = chainHead.storage$(
      at,
      "descendantsValues",
      (ctx) => {
        if (!isCompatible(ctx)) throw checksumError()

        const codecs = ctx.dynamicBuilder.buildStorage(pallet, name)
        if (args.length > codecs.len) throw invalidArgs(args)
        const actualArgs =
          args.length > 0 && isLastArgOptional ? args.slice(0, -1) : args
        if (args.length === codecs.len && actualArgs === args)
          throw invalidArgs(args)
        return codecs.enc(...actualArgs)
      },
      null,
      (values, ctx) => {
        const codecs = ctx.dynamicBuilder.buildStorage(pallet, name)
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

  return { isCompatible, getValue, getValues, getEntries, watchValue }
}
