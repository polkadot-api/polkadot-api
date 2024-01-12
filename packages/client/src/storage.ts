import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  exhaustMap,
  map,
} from "rxjs"
import { firstValueFromWithSignal } from "@/utils"
import { StorageItemInput, StorageResult } from "@polkadot-api/substrate-client"
import { getObservableClient, RuntimeContext } from "./observableClient"

type CallOptions = Partial<{
  at: string
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
  getValue: (options?: CallOptions) => Promise<Payload>
  watchValue: () => Observable<Payload>
}

type StorageEntryWithKeys<Args extends Array<any>, Payload> = {
  getValue: (...args: [...WithCallOptions<Args>]) => Promise<Payload>
  watchValue: (...args: Args) => Observable<Payload>
  getValues: (
    keys: Array<[...Args]>,
    options?: CallOptions,
  ) => Promise<Array<Payload>>
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
  checksum: string,
  pallet: string,
  name: string,
  chainHead: ReturnType<ReturnType<typeof getObservableClient>["chainHead$"]>,
) => {
  const checksumCheck = (ctx: RuntimeContext) => {
    const actualChecksum = ctx.checksumBuilder.buildStorage(pallet, name)
    if (checksum !== actualChecksum)
      throw new Error(`Incompatible runtime entry Storage(${pallet}.${name})`)
  }

  const invalidArgs = (args: Array<any>) =>
    new Error(`Invalid Arguments calling ${pallet}.${name}(${args})`)

  const watchValue = (...args: Array<any>) =>
    chainHead.finalized$.pipe(
      debounceTime(0),
      chainHead.withRuntime((x) => x.hash),
      exhaustMap(([block, ctx]) => {
        checksumCheck(ctx)
        const codecs = ctx.dynamicBuilder.buildStorage(pallet, name)
        return chainHead
          .storage$(block.hash, "value", () => codecs.enc(...args))
          .pipe(
            distinctUntilChanged(),
            map((val) => (val === null ? codecs.fallback : codecs.dec(val))),
          )
      }),
    )

  const getValue = (...args: Array<any>) => {
    const lastArg = args[args.length - 1]
    const isLastArgOptional = isOptionalArg(lastArg)
    const { signal, at: _at }: CallOptions = isLastArgOptional ? lastArg : {}
    const at = _at ?? null

    const result$ = chainHead.storage$(
      at,
      "value",
      (ctx) => {
        const codecs = ctx.dynamicBuilder.buildStorage(pallet, name)
        const actualArgs = args.length === codecs.len ? args : args.slice(0, -1)
        if (args !== actualArgs && !isLastArgOptional) throw invalidArgs(args)
        checksumCheck(ctx)
        return codecs.enc(...actualArgs)
      },
      null,
      (data, ctx) => {
        const codecs = ctx.dynamicBuilder.buildStorage(pallet, name)
        return data === null ? codecs.fallback : codecs.dec(data)
      },
    )
    return firstValueFromWithSignal(result$, signal)
  }

  const getEntries = (...args: Array<any>) => {
    const lastArg = args[args.length - 1]
    const isLastArgOptional = isOptionalArg(lastArg)
    const { signal, at: _at }: CallOptions = isLastArgOptional ? lastArg : {}
    const at = _at ?? null

    const result$ = chainHead.storage$(
      at,
      "descendantsValues",
      (ctx) => {
        const codecs = ctx.dynamicBuilder.buildStorage(pallet, name)
        if (args.length > codecs.len) throw invalidArgs(args)
        const actualArgs =
          args.length > 0 && isLastArgOptional ? args.slice(0, -1) : args
        if (args.length === codecs.len && actualArgs === args)
          throw invalidArgs(args)
        checksumCheck(ctx)
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

  return { getValue, getValues, getEntries, watchValue }
}
