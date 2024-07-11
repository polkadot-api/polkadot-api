import {
  ChainHead$,
  RuntimeContext,
  getObservableClient,
} from "@polkadot-api/observable-client"
import {
  Observable,
  ReplaySubject,
  combineLatest,
  connectable,
  filter,
  firstValueFrom,
  map,
} from "rxjs"
import { DescriptorValues } from "./descriptors"
import { Tuple, Vector } from "@polkadot-api/substrate-bindings"
import {
  EntryPoint,
  EntryPointCodec,
  TypedefCodec,
  entryPointsAreCompatible,
  CompatibilityCache,
  TypedefNode,
  mapLookupToTypedef,
  CompatibilityLevel,
} from "@polkadot-api/metadata-compatibility"
import { getLookupFn, LookupEntry } from "@polkadot-api/metadata-builders"

export const enum OpType {
  Storage = "storage",
  Tx = "tx",
  Event = "events",
  Error = "errors",
  Const = "constants",
}

export class Runtime {
  private constructor(
    private _ctx: RuntimeContext,
    private _metadataTypes: MetadataTypes,
    private _descriptors: DescriptorValues,
  ) {}

  /**
   * @access package  - Internal implementation detail. Do not use.
   */
  static _create(
    ctx: RuntimeContext,
    metadataTypes: MetadataTypes,
    descriptors: DescriptorValues,
  ) {
    return new Runtime(ctx, metadataTypes, descriptors)
  }

  /**
   * @access package  - Internal implementation detail. Do not use.
   */
  _getCtx() {
    return this._ctx
  }

  /**
   * @access package  - Internal implementation detail. Do not use.
   */
  _getPalletEntryPoint(
    opType: OpType,
    pallet: string,
    name: string,
  ): EntryPoint {
    return this._metadataTypes[0][this._descriptors[opType][pallet][name]]
  }

  /**
   * @access package  - Internal implementation detail. Do not use.
   */
  _getApiEntryPoint(name: string, method: string) {
    return this._metadataTypes[0][this._descriptors.apis[name][method]]
  }

  /**
   * @access package  - Internal implementation detail. Do not use.
   */
  _getTypedefNodes() {
    return this._metadataTypes[1]
  }
}

export type RuntimeApi = Observable<Runtime> & {
  /**
   * @returns Promise that resolves in the `Runtime` as soon as it's
   *          loaded.
   */
  latest: () => Promise<Runtime>
}

const EntryPointsCodec = Vector(EntryPointCodec)
const TypedefsCodec = Vector(TypedefCodec)
const TypesCodec = Tuple(EntryPointsCodec, TypedefsCodec)
type MetadataTypes = ReturnType<(typeof TypesCodec)["dec"]>
const decodedMetadataTypes = new WeakMap<Uint8Array, MetadataTypes>()

export const getRuntimeApi = (
  metadataTypes: Promise<Uint8Array>,
  descriptors: Promise<DescriptorValues>,
  chainHead: ReturnType<ReturnType<typeof getObservableClient>["chainHead$"]>,
): RuntimeApi => {
  const decodedMetadata = metadataTypes.then((byteArr) => {
    if (decodedMetadataTypes.has(byteArr)) {
      return decodedMetadataTypes.get(byteArr)!
    }
    const result = TypesCodec.dec(byteArr)
    decodedMetadataTypes.set(byteArr, result)
    return result
  })

  const runtimeWithDescriptors$ = connectable(
    combineLatest([chainHead.runtime$, decodedMetadata, descriptors]).pipe(
      map(([x, metadataTypes, descriptors]) =>
        x ? Runtime._create(x, metadataTypes, descriptors) : null,
      ),
    ),
    {
      connector: () => new ReplaySubject(1),
    },
  )
  runtimeWithDescriptors$.connect()

  const result = runtimeWithDescriptors$.pipe(
    filter((v) => Boolean(v)),
  ) as RuntimeApi
  result.latest = () => firstValueFrom(result)

  return result
}

// metadataRaw -> cache
const metadataCache = new WeakMap<
  Uint8Array,
  {
    compat: CompatibilityCache
    lookup: (id: number) => LookupEntry
    typeNodes: (TypedefNode | null)[]
  }
>()
const getMetadataCache = (ctx: RuntimeContext) => {
  if (!metadataCache.has(ctx.metadataRaw)) {
    metadataCache.set(ctx.metadataRaw, {
      compat: new Map(),
      lookup: getLookupFn(ctx.metadata.lookup),
      typeNodes: [],
    })
  }
  return metadataCache.get(ctx.metadataRaw)!
}
export const compatibilityHelper = (
  runtimeApi: RuntimeApi,
  getDescriptorEntryPoint: (runtime: Runtime) => EntryPoint,
  getRuntimeEntryPoint: (ctx: RuntimeContext) => EntryPoint,
) => {
  function getCompatibilityLevelSync(
    runtimeWithDescriptors: Runtime,
    /**
     * The `Runtime` of runtimeWithDescriptors already has a RuntimeContext,
     * which is the runtime of the finalized block.
     * But on some cases, the user wants to perform an action on a specific
     * block hash, which has a different RuntimeContext.
     */
    ctx: RuntimeContext = runtimeWithDescriptors._getCtx(),
  ) {
    const descriptorEntryPoint = getDescriptorEntryPoint(runtimeWithDescriptors)
    const runtimeEntryPoint = getRuntimeEntryPoint(ctx)
    const descriptorNodes = runtimeWithDescriptors._getTypedefNodes()

    const cache = getMetadataCache(ctx)

    return entryPointsAreCompatible(
      descriptorEntryPoint,
      (id) => descriptorNodes[id],
      runtimeEntryPoint,
      (id) => (cache.typeNodes[id] ||= mapLookupToTypedef(cache.lookup(id))),
      cache.compat,
    ).level
  }

  const getCompatibilityLevel = withOptionalRuntime(
    runtimeApi,
    getCompatibilityLevelSync,
  )
  const isCompatible = withOptionalRuntime(runtimeApi, (runtime) => {
    return getCompatibilityLevelSync(runtime) > CompatibilityLevel.Partial
  })

  const waitDescriptors = async () => {
    const runtime = await runtimeApi.latest()
    return (ctx: RuntimeContext) =>
      getCompatibilityLevelSync(runtime, ctx) > CompatibilityLevel.Partial
  }
  const compatibleRuntime$ = (
    chainHead: ChainHead$,
    hash: string | null,
    error: () => Error,
  ) =>
    combineLatest([chainHead.getRuntimeContext$(hash), waitDescriptors()]).pipe(
      map(([ctx, isCompatible]) => {
        if (!isCompatible(ctx)) {
          throw error()
        }
        return ctx
      }),
    )

  const withCompatibleRuntime =
    <T>(chainHead: ChainHead$, mapper: (x: T) => string, error: () => Error) =>
    (source$: Observable<T>): Observable<[T, RuntimeContext]> =>
      combineLatest([
        source$.pipe(chainHead.withRuntime(mapper)),
        waitDescriptors(),
      ]).pipe(
        map(([[x, ctx], isCompatible]) => {
          if (!isCompatible(ctx)) {
            throw error()
          }
          return [x, ctx]
        }),
      )

  return {
    getCompatibilityLevel,
    isCompatible,
    waitDescriptors,
    withCompatibleRuntime,
    compatibleRuntime$,
  }
}
export type CompatibilityHelper = ReturnType<typeof compatibilityHelper>

const withOptionalRuntime =
  <T>(
    runtimeApi: RuntimeApi,
    fn: (runtime: Runtime) => T,
  ): WithOptionalRuntime<T> =>
  (runtime?: Runtime): any =>
    runtime ? fn(runtime) : runtimeApi.latest().then(fn)
export type WithOptionalRuntime<T> = {
  /**
   * Returns the result after waiting for the runtime to load.
   */
  (): Promise<T>
  /**
   * Returns the result synchronously with the loaded runtime.
   */
  (runtime: Runtime): T
}

export interface CompatibilityFunctions {
  /**
   * Returns the `CompatibilityLevel` for this call comparing the descriptors
   * generated on dev time with the current live metadata.
   */
  getCompatibilityLevel: WithOptionalRuntime<CompatibilityLevel>
}
