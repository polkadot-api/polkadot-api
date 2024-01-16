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

export interface Runtime<T extends Record<string, Descriptors>> {
  constants: {
    [K in keyof T]: ConstFromDescriptors<T[K]>
  }
  isCompatible: (
    cb: (api: {
      [K in keyof T]: {
        query: StorageRuntime<QueryFromDescriptors<T[K]>>
        tx: TxRuntime<TxFromDescriptors<T[K]>>
        event: PlainRuntime<EventsFromDescriptors<T[K]>>
        const: PlainRuntime<ConstFromDescriptors<T[K]>>
      }
    }) => boolean,
  ) => boolean
}

export type RuntimeApi<T extends Record<string, Descriptors>> = Observable<
  Runtime<T>
> & {
  latest: () => Promise<Runtime<T>>
}

const createRuntime = <T extends Record<string, Descriptors>>(
  descriptors: T,
  ctx: RuntimeContext,
): Runtime<T> => {
  const constants = mapObject(descriptors, (inner) =>
    mapObject(inner, (_, palletName) => {
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
    }),
  )

  const isCompatibleMapper = (
    idx: 0 | 1 | 2 | 4,
    builder: "buildStorage" | "buildEvent" | "buildCall" | "buildConstant",
    descriptor: Descriptors,
  ) =>
    mapObject(
      descriptor,
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

  const isCompatibleApi = mapObject(descriptors, (inner) => ({
    query: isCompatibleMapper(0, "buildStorage", inner),
    tx: isCompatibleMapper(1, "buildCall", inner),
    event: isCompatibleMapper(2, "buildEvent", inner),
    const: isCompatibleMapper(4, "buildConstant", inner),
  }))

  const isCompatible: (cb: (api: any) => boolean) => boolean = (cb) =>
    cb(isCompatibleApi)

  return {
    constants,
    isCompatible,
  } as any
}

export const getRuntimeApi = <T extends Record<string, Descriptors>>(
  descriptors: T,
  chainHead: ReturnType<ReturnType<typeof getObservableClient>["chainHead$"]>,
): RuntimeApi<T> => {
  let latestRuntime: Promise<Runtime<T>>
  let resolve: ((r: Runtime<T>) => void) | null = null

  latestRuntime = new Promise<Runtime<T>>((res) => {
    resolve = res
  })

  chainHead.runtime$.subscribe((x) => {
    if (x) {
      resolve!(createRuntime(descriptors, x))
      resolve = null
    } else if (!resolve) {
      latestRuntime = new Promise<Runtime<T>>((res) => {
        resolve = res
      })
    }
  })

  const result = chainHead.runtime$.pipe(
    filter(Boolean),
    map((x) => createRuntime(descriptors, x)),
  ) as RuntimeApi<T>
  result.latest = () => latestRuntime

  return result
}
