import {
  ConstFromDescriptors,
  Descriptors,
  EventsFromDescriptors,
  HexString,
  QueryFromDescriptors,
  TxFromDescriptors,
} from "@polkadot-api/substrate-bindings"
import { RuntimeContext, getObservableClient } from "./observableClient"
import { Observable, filter, map } from "rxjs"
import { mapObject } from "@polkadot-api/utils"

type StorageRuntime<
  A extends Record<
    string,
    Record<
      string,
      | {
          KeyArgs: Array<any>
          Value: any
          IsOptional: false | true
        }
      | unknown
    >
  >,
> = {
  [K in keyof A]: {
    [KK in keyof A[K]]: boolean
  }
}

type TxRuntime<A extends Record<string, Record<string, Array<any> | unknown>>> =
  {
    [K in keyof A]: {
      [KK in keyof A[K]]: boolean
    }
  }

type PlainRuntime<A extends Record<string, Record<string, any>>> = {
  [K in keyof A]: {
    [KK in keyof A[K]]: boolean
  }
}

type MappedKey<K extends string, V> = `${K}${V extends Record<string, any>
  ? `.${Paths<V>}`
  : ""}`
type KeyMap<T> = {
  [K in keyof T & string]: MappedKey<K, T[K]>
}
type Paths<T> = KeyMap<T>[keyof T & string]

export interface Runtime<D extends Descriptors> {
  constants: ConstFromDescriptors<D>
  isCompatible: (
    cb: (api: {
      query: StorageRuntime<QueryFromDescriptors<D>>
      tx: TxRuntime<TxFromDescriptors<D>>
      event: PlainRuntime<EventsFromDescriptors<D>>
      const: PlainRuntime<ConstFromDescriptors<D>>
    }) => boolean,
  ) => boolean
}

export type RuntimeApi<T extends Descriptors> = Observable<Runtime<T>> & {
  latest: () => Promise<Runtime<T>>
}

const createRuntime = <D extends Descriptors>(
  descriptors: D,
  ctx: RuntimeContext,
): Runtime<D> => {
  const constants = mapObject(descriptors.pallets, (_, palletName) => {
    const pallet = ctx.metadata.pallets.find((p) => p.name === palletName)
    const palletConstants: Record<
      string,
      { cache: false; value: HexString } | { cache: true; value: any }
    > = {}
    pallet?.constants.forEach((c) => {
      palletConstants[c.name] = { cache: false, value: c.value }
    })

    return new Proxy(
      {},
      {
        get(_, name: string) {
          const cached = palletConstants[name]
          if (cached.cache) return cached.value

          cached.cache = true as any
          return (cached.value = ctx.dynamicBuilder
            .buildConstant(palletName, name)
            .dec(cached.value))
        },
      },
    )
  })
  const isCompatibleMapper = (
    idx: 0 | 1 | 2 | 4,
    builder: "buildStorage" | "buildEvent" | "buildCall" | "buildConstant",
  ) =>
    mapObject(
      descriptors.pallets,
      (x, pallet: string) =>
        new Proxy(
          {},
          {
            get(_, name: string) {
              return ctx.checksumBuilder[builder](pallet, name) === x[idx][name]
            },
          },
        ),
    )

  const isCompatibleApi = {
    query: isCompatibleMapper(0, "buildStorage"),
    tx: isCompatibleMapper(1, "buildCall"),
    event: isCompatibleMapper(2, "buildEvent"),
    const: isCompatibleMapper(4, "buildConstant"),
  }

  const isCompatible: (cb: (api: any) => boolean) => boolean = (cb) =>
    cb(isCompatibleApi)

  return {
    constants,
    isCompatible,
  } as any
}

export const getRuntimeApi = <D extends Descriptors>(
  descriptors: D,
  chainHead: ReturnType<ReturnType<typeof getObservableClient>["chainHead$"]>,
): RuntimeApi<D> => {
  let latestRuntime: Promise<Runtime<D>>
  let resolve: ((r: Runtime<D>) => void) | null = null

  latestRuntime = new Promise<Runtime<D>>((res) => {
    resolve = res
  })

  chainHead.runtime$.subscribe((x) => {
    if (x) {
      resolve!(createRuntime(descriptors, x))
      resolve = null
    } else if (!resolve) {
      latestRuntime = new Promise<Runtime<D>>((res) => {
        resolve = res
      })
    }
  })

  const result = chainHead.runtime$.pipe(
    filter(Boolean),
    map((x) => createRuntime(descriptors, x)),
  ) as RuntimeApi<D>
  result.latest = () => latestRuntime

  return result
}
