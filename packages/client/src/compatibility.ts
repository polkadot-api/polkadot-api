import type { MetadataLookup } from "@polkadot-api/metadata-builders"
import {
  CompatibilityLevel,
  type CompatibilityCache,
  type EntryPoint,
  type TypedefNode,
} from "@polkadot-api/metadata-compatibility"
import {
  ChainHead$,
  getObservableClient,
  RuntimeContext,
} from "@polkadot-api/observable-client"
import { Tuple, Vector } from "@polkadot-api/substrate-bindings"
import { combineLatest, filter, firstValueFrom, map, Observable } from "rxjs"
import { ChainDefinition } from "./descriptors"

const metadataCompatibility = import("@polkadot-api/metadata-compatibility")
export type MetadataCompatibilityModule = Awaited<typeof metadataCompatibility>

export class CompatibilityToken<D = unknown> {
  // @ts-ignore
  private constructor(protected _descriptors: D) {}
}

interface CompatibilityTokenApi {
  runtime: () => RuntimeContext
  typedefNodes: TypedefNode[]
  getPalletEntryPoint: (
    opType: OpType,
    pallet: string,
    name: string,
  ) => EntryPoint
  getApiEntryPoint: (name: string, method: string) => EntryPoint
  compatModule: MetadataCompatibilityModule
}
const compatibilityTokenApi = new WeakMap<
  CompatibilityToken,
  CompatibilityTokenApi
>()
export const getCompatibilityApi = (token: CompatibilityToken) =>
  compatibilityTokenApi.get(token)!

export const enum OpType {
  Storage = "storage",
  Tx = "tx",
  Event = "events",
  Error = "errors",
  Const = "constants",
}

const typesCodec = metadataCompatibility.then(
  ({ EntryPointCodec, TypedefCodec }) => {
    const EntryPointsCodec = Vector(EntryPointCodec)
    const TypedefsCodec = Vector(TypedefCodec)
    return Tuple(EntryPointsCodec, TypedefsCodec)
  },
)

export const createCompatibilityToken = <D extends ChainDefinition>(
  chainDefinition: D,
  chainHead: ReturnType<ReturnType<typeof getObservableClient>["chainHead$"]>,
): Promise<CompatibilityToken<D>> => {
  const awaitedRuntime = new Promise<() => RuntimeContext>(async (resolve) => {
    const loadedRuntime$ = chainHead.runtime$.pipe(filter((v) => v != null))

    let latest = await firstValueFrom(loadedRuntime$)
    loadedRuntime$.subscribe((v) => (latest = v))

    resolve(() => latest)
  })

  const promise = Promise.all([
    metadataCompatibility,
    typesCodec.then((codec) => chainDefinition.metadataTypes.then(codec.dec)),
    chainDefinition.descriptors,
    awaitedRuntime,
  ]).then(
    ([compatModule, [entryPoints, typedefNodes], descriptors, runtime]) => {
      const token = new (CompatibilityToken as any)()
      compatibilityTokenApi.set(token, {
        runtime,
        getPalletEntryPoint(opType, pallet, name) {
          return entryPoints[descriptors[opType][pallet][name]]
        },
        getApiEntryPoint(name, method) {
          return entryPoints[descriptors.apis[name][method]]
        },
        typedefNodes,
        compatModule,
      })

      return token
    },
  )

  return promise
}

// metadataRaw -> cache
const metadataCache = new WeakMap<
  Uint8Array,
  {
    compat: CompatibilityCache
    lookup: MetadataLookup
    typeNodes: (TypedefNode | null)[]
  }
>()
const getMetadataCache = (ctx: RuntimeContext) => {
  if (!metadataCache.has(ctx.metadataRaw)) {
    metadataCache.set(ctx.metadataRaw, {
      compat: new Map(),
      lookup: ctx.lookup,
      typeNodes: [],
    })
  }
  return metadataCache.get(ctx.metadataRaw)!
}
export const compatibilityHelper = (
  descriptors: Promise<CompatibilityToken>,
  getDescriptorEntryPoint: (descriptorApi: CompatibilityTokenApi) => EntryPoint,
  getRuntimeEntryPoint: (ctx: RuntimeContext) => EntryPoint,
) => {
  const getRuntimeTypedef = (
    token: CompatibilityToken,
    ctx: RuntimeContext,
    id: number,
  ) => {
    const cache = getMetadataCache(ctx)
    return (cache.typeNodes[id] ||= compatibilityTokenApi
      .get(token)!
      .compatModule.mapLookupToTypedef(cache.lookup(id)))
  }

  function getCompatibilityLevels(
    descriptors: CompatibilityToken,
    /**
     * The `Runtime` of runtimeWithDescriptors already has a RuntimeContext,
     * which is the runtime of the finalized block.
     * But on some cases, the user wants to perform an action on a specific
     * block hash, which has a different RuntimeContext.
     */
    ctx?: RuntimeContext,
  ) {
    const compatibilityApi = compatibilityTokenApi.get(descriptors)!
    ctx ||= compatibilityApi.runtime()
    const descriptorEntryPoint = getDescriptorEntryPoint(compatibilityApi)
    const runtimeEntryPoint = getRuntimeEntryPoint(ctx)
    const { typedefNodes, compatModule } = compatibilityApi

    const cache = getMetadataCache(ctx)

    return compatModule.entryPointsAreCompatible(
      descriptorEntryPoint,
      (id) => typedefNodes[id],
      runtimeEntryPoint,
      (id) => getRuntimeTypedef(descriptors, ctx, id),
      cache.compat,
    )
  }

  const getCompatibilityLevel = withOptionalToken(descriptors, (runtime) =>
    minCompatLevel(getCompatibilityLevels(runtime)),
  )

  const waitDescriptors = () => descriptors
  const compatibleRuntime$ = (chainHead: ChainHead$, hash: string | null) =>
    combineLatest([waitDescriptors(), chainHead.getRuntimeContext$(hash)])

  const withCompatibleRuntime =
    <T>(chainHead: ChainHead$, mapper: (x: T) => string) =>
    (
      source$: Observable<T>,
    ): Observable<[T, CompatibilityToken, RuntimeContext]> =>
      combineLatest([
        source$.pipe(chainHead.withRuntime(mapper)),
        waitDescriptors(),
      ]).pipe(map(([[x, ctx], descriptors]) => [x, descriptors, ctx]))

  const argsAreCompatible = (
    descriptors: CompatibilityToken,
    ctx: RuntimeContext,
    args: unknown,
  ) => {
    const levels = getCompatibilityLevels(descriptors, ctx)
    if (levels.args === CompatibilityLevel.Incompatible) return false
    if (levels.args > CompatibilityLevel.Partial) return true
    // Although technically args could still be compatible, if the output will be incompatible we might as well just return false to skip sending the request.
    if (levels.values === CompatibilityLevel.Incompatible) return false

    const entryPoint = getRuntimeEntryPoint(ctx)

    const { compatModule } = compatibilityTokenApi.get(descriptors)!

    return compatModule.valueIsCompatibleWithDest(
      entryPoint.args,
      (id) => getRuntimeTypedef(descriptors, ctx, id),
      args,
    )
  }
  const valuesAreCompatible = (
    descriptors: CompatibilityToken,
    ctx: RuntimeContext,
    values: unknown,
  ) => {
    const level = getCompatibilityLevels(descriptors, ctx).values
    if (level === CompatibilityLevel.Incompatible) return false
    if (level > CompatibilityLevel.Partial) return true

    const compatibilityApi = compatibilityTokenApi.get(descriptors)!

    const entryPoint = getDescriptorEntryPoint(compatibilityApi)

    return compatibilityApi.compatModule.valueIsCompatibleWithDest(
      entryPoint.values,
      (id) => compatibilityApi.typedefNodes[id],
      values,
    )
  }

  return {
    getCompatibilityLevel,
    getCompatibilityLevels,
    waitDescriptors,
    withCompatibleRuntime,
    compatibleRuntime$,
    argsAreCompatible,
    valuesAreCompatible,
    getRuntimeTypedef,
  }
}
export type CompatibilityHelper = ReturnType<typeof compatibilityHelper>

export const minCompatLevel = (levels: {
  args: CompatibilityLevel
  values: CompatibilityLevel
}) => Math.min(levels.args, levels.values)

const withOptionalToken =
  <T, D>(
    compatibilityToken: Promise<CompatibilityToken<D>>,
    fn: (runtime: CompatibilityToken) => T,
  ): WithOptionalRuntime<T, D> =>
  (runtime?: CompatibilityToken): any =>
    runtime ? fn(runtime) : compatibilityToken.then(fn)

export type WithOptionalRuntime<T, D> = {
  /**
   * Returns the result after waiting for the runtime to load.
   */
  (): Promise<T>
  /**
   * Returns the result synchronously with the loaded runtime.
   */
  (runtime: CompatibilityToken<D>): T
}

export interface CompatibilityFunctions<D> {
  /**
   * Returns the `CompatibilityLevel` for this call comparing the descriptors
   * generated on dev time with the current live metadata.
   */
  getCompatibilityLevel: WithOptionalRuntime<CompatibilityLevel, D>
}