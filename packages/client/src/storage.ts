import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  exhaustMap,
  map,
  mergeMap,
  withLatestFrom,
} from "rxjs"
import { firstValueFromWithSignal } from "@/utils"
import { StorageItemInput, StorageResult } from "@polkadot-api/substrate-client"
import { getDynamicBuilder } from "@polkadot-api/metadata-builders"
import { RuntimeContext } from "./observableClient/chainHead/chainHead"

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
  getRuntimeContext$: (hash: string | null) => Observable<RuntimeContext>,
  storage$: Storage$,
  finalized$: Observable<string>,
) => {
  const storageCall = <T, Type extends StorageItemInput["type"]>(
    at: string | null,
    mapper: (
      codecs: ReturnType<ReturnType<typeof getDynamicBuilder>["buildStorage"]>,
    ) => [
      block: string | null,
      args: [type: Type, key: string, childTrie: string | null],
      decoder: (input: StorageResult<Type>) => T,
    ],
    signal?: AbortSignal,
  ): Promise<T> => {
    const request$ = getRuntimeContext$(at).pipe(
      mergeMap((descriptors) => {
        const actualChecksum = descriptors.checksumBuilder.buildStorage(
          pallet,
          name,
        )
        const codecs = descriptors.dynamicBuilder.buildStorage(pallet, name)
        if (checksum !== actualChecksum)
          throw new Error(
            `Incompatible runtime entry Storage(${pallet}.${name})`,
          )

        const [block, args, decoder] = mapper(codecs)
        return storage$(block, ...args).pipe(map(decoder))
      }),
    )
    return firstValueFromWithSignal(request$, signal)
  }

  const watchValue = (...args: Array<any>) => {
    const descriptors$ = finalized$.pipe(
      mergeMap(getRuntimeContext$),
      distinctUntilChanged(),
      map((descriptors) =>
        descriptors.dynamicBuilder.buildStorage(pallet, name),
      ),
    )

    return finalized$.pipe(
      debounceTime(0),
      withLatestFrom(descriptors$),
      exhaustMap(([latest, codecs]) =>
        storage$(latest, "value", codecs.enc(...args), null).pipe(
          map((val) => ({ val, codecs })),
        ),
      ),
      distinctUntilChanged((a, b) => a.val === b.val),
      map(({ codecs, val }) =>
        val === null ? codecs.fallback : codecs.dec(val),
      ),
    )
  }

  const getValue = (...args: Array<any>) => {
    const invalidArgs = () =>
      new Error(`Invalid Arguments calling ${pallet}.${name}(${args})`)

    const lastArg = args[args.length - 1]
    const isLastArgOptional = isOptionalArg(lastArg)
    const { signal, at: _at }: CallOptions = isLastArgOptional ? lastArg : {}
    const at = _at ?? null

    return storageCall(
      at ?? null,
      (codecs) => {
        const actualArgs = args.length === codecs.len ? args : args.slice(0, -1)

        if (args !== actualArgs && !isLastArgOptional) throw invalidArgs()

        const key = codecs.enc(...actualArgs)
        return [
          at,
          ["value", key, null],
          (response: StorageResult<"value">) =>
            response === null
              ? codecs.fallback
              : codecs.dec(response as string),
        ]
      },
      signal,
    )
  }

  const getEntries = (...args: Array<any>) => {
    const invalidArgs = () =>
      new Error(`Invalid Arguments calling ${pallet}.${name}(${args})`)

    const lastArg = args[args.length - 1]
    const isLastArgOptional = isOptionalArg(lastArg)
    const { signal, at: _at }: CallOptions = isLastArgOptional ? lastArg : {}
    const at = _at ?? null

    return storageCall(
      at,
      (codecs) => {
        if (args.length > codecs.len) throw invalidArgs()

        const actualArgs =
          args.length > 0 && isLastArgOptional ? args.slice(0, -1) : args

        if (args.length === codecs.len && actualArgs === args)
          throw invalidArgs()

        return [
          at,
          ["descendantsValues", codecs.enc(...actualArgs), null],
          (x: StorageResult<"descendantsValues">) => {
            return x.map(({ key, value }) => ({
              keyArgs: codecs.keyDecoder(key),
              value: codecs.dec(value),
            }))
          },
        ]
      },
      signal,
    )
  }

  const getValues = (keyArgs: Array<Array<any>>, options?: CallOptions) =>
    Promise.all(
      keyArgs.map((args) => getValue(...(options ? [...args, options] : args))),
    )

  return { getValue, getValues, getEntries, watchValue }
}
