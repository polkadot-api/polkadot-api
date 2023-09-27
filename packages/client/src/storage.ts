import {
  ArgsWithPayloadCodec,
  DescriptorCommon,
  StorageDescriptor,
} from "@polkadot-api/substrate-bindings"
import { Observable, filter, map, mergeMap, take } from "rxjs"
import { StorageItemInput, StorageResult } from "@polkadot-api/substrate-client"
import { RuntimeDescriptors } from "./codecs"
import { firstValueFromWithSignal } from "./utils/firstValueFromWithSignal"

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
  getValue: (...args: WithCallOptions<Args>) => Promise<Payload | undefined>
  getValues: (
    keyArgs: Array<Args>,
    options?: CallOptions,
  ) => Promise<Array<Payload | undefined>>
  getEntries: (
    ...args: WithCallOptions<PossibleParents<Args>>
  ) => Promise<Array<{ keyArgs: Args; value: Payload }>>
}

export type StorageEntry<Args extends Array<any>, Payload> = Args extends []
  ? StorageEntryWithoutKeys<Payload>
  : StorageEntryWithKeys<Args, Payload>

type Storage$ = <Type extends StorageItemInput["type"]>(
  hash: string | null,
  type: Type,
  key: string,
  childTrie: string | null,
) => Observable<StorageResult<Type>>

export const createStorageEntry = <
  Descriptor extends StorageDescriptor<
    DescriptorCommon<string, string>,
    ArgsWithPayloadCodec<any, any>
  >,
>(
  descriptor: Descriptor,
  codecs$: Observable<RuntimeDescriptors | null>,
  storage$: Storage$,
) => {
  const storageCall = <T, Type extends StorageItemInput["type"]>(
    block: string | null,
    mapper: (
      descriptors: RuntimeDescriptors,
    ) => [
      [type: Type, key: string, childTrie: string | null],
      (input: StorageResult<Type>) => T,
    ],
    signal?: AbortSignal,
  ): Promise<T> => {
    const descriptors$ = codecs$.pipe(filter(Boolean))
    const request$ = descriptors$.pipe(
      take(1),
      mergeMap((descriptors) => {
        const [args, decoder] = mapper(descriptors)
        return storage$(block, ...args).pipe(map(decoder))
      }),
    )
    return firstValueFromWithSignal(request$, signal)
  }

  const getValue = (...args: Array<any>) => {
    const { pallet, name } = descriptor.props
    const invalidArgs = () =>
      new Error(`Invalid Arguments calling ${pallet}.${name}(${args})`)
    if (
      args.length < descriptor.codecs.len ||
      args.length > descriptor.codecs.len + 1
    )
      throw invalidArgs()

    const [actualArgs, options] =
      args.length === descriptor.codecs.len
        ? [args, {} as CallOptions]
        : [args.slice(0, -1), args[args.length - 1] as CallOptions]

    if (typeof options !== "object") throw invalidArgs()
    const { signal, at } = options

    return storageCall(
      at ?? null,
      (descriptors) => {
        const codecs = descriptors.storage[pallet]?.[name]
        if (!codecs)
          throw new Error(`Incompatible runtime entry (${pallet}.${name})`)

        const key = codecs.enc(...actualArgs)
        return [
          ["value", key, null],
          (response: StorageResult<"value">) =>
            response && codecs.dec(response as string),
        ]
      },
      signal,
    )
  }

  if (descriptor.codecs.len === 0) return { getValue }

  const getEntries = (...args: Array<any>) => {
    const { pallet, name } = descriptor.props
    const invalidArgs = () =>
      new Error(`Invalid Arguments calling ${pallet}.${name}(${args})`)

    if (args.length > descriptor.codecs.len) throw invalidArgs()

    let options: CallOptions = {}
    let actualArgs = args

    if (args.length > 0) {
      const lastArg = args[args.length - 1]
      if (typeof lastArg === "object") {
        const keys = Object.keys(lastArg)
        if (
          keys.every(
            (k) =>
              (k === "at" && typeof lastArg.at === "string") ||
              (k === "signal" && lastArg.signal instanceof AbortSignal),
          )
        ) {
          options = lastArg
          actualArgs = args.slice(0, -1)
        }
      }
    }

    if (args.length === descriptor.codecs.len && actualArgs === args)
      throw invalidArgs()

    const { signal, at } = options

    return storageCall(
      at ?? null,
      (descriptors) => {
        const codecs = descriptors.storage[pallet]?.[name]
        if (!codecs)
          throw new Error(`Incompatible runtime entry (${pallet}.${name})`)

        const key = codecs.enc(...actualArgs)
        return [
          ["descendantsValues", key, null],
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

  return { getValue, getValues, getEntries }
}
