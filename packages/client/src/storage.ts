import { Observable, filter, map, mergeMap, take } from "rxjs"
import { firstValueFromWithSignal } from "@/utils"
import { StorageItemInput, StorageResult } from "@polkadot-api/substrate-client"
import { getDynamicBuilder } from "@polkadot-api/substrate-codegen"
import { Codecs$ } from "./codecs"

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
}

type StorageEntryWithKeys<Args extends Array<any>, Payload> = {
  getValue: (...args: [...WithCallOptions<Args>]) => Promise<Payload>
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
  codecs$: Codecs$,
  storage$: Storage$,
) => {
  const storageCall = <T, Type extends StorageItemInput["type"]>(
    mapper: (
      codecs: ReturnType<ReturnType<typeof getDynamicBuilder>["buildStorage"]>,
    ) => [
      block: string | null,
      args: [type: Type, key: string, childTrie: string | null],
      decoder: (input: StorageResult<Type>) => T,
    ],
    signal?: AbortSignal,
  ): Promise<T> => {
    const descriptors$ = codecs$.pipe(filter(Boolean))
    const request$ = descriptors$.pipe(
      take(1),
      mergeMap((descriptors) => {
        const [actualChecksum, codecs] = descriptors("stg", pallet, name)
        if (checksum !== actualChecksum)
          throw new Error(`Incompatible runtime entry (${pallet}.${name})`)

        const [block, args, decoder] = mapper(codecs)
        return storage$(block, ...args).pipe(map(decoder))
      }),
    )
    return firstValueFromWithSignal(request$, signal)
  }

  const getValue = (...args: Array<any>) => {
    const invalidArgs = () =>
      new Error(`Invalid Arguments calling ${pallet}.${name}(${args})`)

    const lastArg = args[args.length - 1]
    const signal: AbortSignal | undefined =
      typeof lastArg === "object" && lastArg.signal instanceof AbortSignal
        ? lastArg.signal
        : undefined

    return storageCall((codecs) => {
      const [actualArgs, options] =
        args.length === codecs.len
          ? [args, {} as CallOptions]
          : [args.slice(0, -1), args[args.length - 1] as CallOptions]

      if (args !== actualArgs && !isOptionalArg(options)) {
        console.log({ cLen: codecs.len, aLen: args.length, args })
        throw invalidArgs()
      }

      const key = codecs.enc(...actualArgs)
      return [
        options.at ?? null,
        ["value", key, null],
        (response: StorageResult<"value">) =>
          response === null ? codecs.fallback : codecs.dec(response as string),
      ]
    }, signal)
  }

  const getEntries = (...args: Array<any>) => {
    const invalidArgs = () =>
      new Error(`Invalid Arguments calling ${pallet}.${name}(${args})`)

    const lastArg = args[args.length - 1]
    const signal: AbortSignal | undefined =
      typeof lastArg === "object" && lastArg.signal instanceof AbortSignal
        ? lastArg.signal
        : undefined

    return storageCall((codecs) => {
      if (args.length > codecs.len) throw invalidArgs()

      let options: CallOptions = {}
      let actualArgs = args

      if (args.length > 0) {
        const lastArg = args[args.length - 1]
        if (isOptionalArg(lastArg)) {
          options = lastArg
          actualArgs = args.slice(0, -1)
        }
      }

      if (args.length === codecs.len && actualArgs === args) throw invalidArgs()

      return [
        options.at ?? null,
        ["descendantsValues", codecs.enc(...actualArgs), null],
        (x: StorageResult<"descendantsValues">) => {
          return x.map(({ key, value }) => ({
            keyArgs: codecs.keyDecoder(key),
            value: codecs.dec(value),
          }))
        },
      ]
    }, signal)
  }

  const getValues = (keyArgs: Array<Array<any>>, options?: CallOptions) =>
    Promise.all(
      keyArgs.map((args) => getValue(...(options ? [...args, options] : args))),
    )

  return { getValue, getValues, getEntries }
}
