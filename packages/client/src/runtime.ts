import {
  ConstFromDescriptors,
  Descriptors,
  HexString,
} from "@polkadot-api/substrate-bindings"
import { mapObject } from "@polkadot-api/utils"
import { Observable, filter, firstValueFrom, map } from "rxjs"
import { RuntimeContext, getObservableClient } from "./observableClient"

export interface Runtime<D extends Descriptors> {
  constants: ConstFromDescriptors<D>
  constantIsCompatible: ConstIsCompatible<D>
  ctx: RuntimeContext
}

type ConstIsCompatible<D extends Descriptors> = <K extends keyof D["pallets"]>(
  pallet: K & string,
  name: keyof D["pallets"][K][4] & string,
) => boolean

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

  const constantIsCompatible: ConstIsCompatible<D> = (pallet, name) => {
    const descriptorChecksum = descriptors.pallets[pallet][4][name]
    const actualChecksum = ctx.checksumBuilder.buildConstant(pallet, name)
    return descriptorChecksum === actualChecksum
  }

  return {
    constants: constants as any,
    constantIsCompatible,
    ctx,
  }
}

export interface IsCompatible {
  (): Promise<boolean>
  (runtime: Runtime<any>): boolean
}
export function createIsCompatible(
  chainHead: ReturnType<ReturnType<typeof getObservableClient>["chainHead$"]>,
  cb: (ctx: RuntimeContext) => boolean,
): IsCompatible {
  return (runtime?: Runtime<any>): any => {
    if (runtime) {
      return cb(runtime.ctx)
    }

    return firstValueFrom(chainHead.runtime$.pipe(filter(Boolean), map(cb)))
  }
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
      if (resolve) {
        resolve(createRuntime(descriptors, x))
        resolve = null
      } else {
        latestRuntime = Promise.resolve(createRuntime(descriptors, x))
      }
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
