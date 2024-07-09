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
} from "@polkadot-api/metadata-compatibility"

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
  ): EntryPoint | null {
    const idx = this._descriptors[opType][pallet][name]
    if (idx == null) return null
    if (opType === OpType.Const) {
      // Constants don't have an entry point, they are directly the lookup type
      return {
        args: [],
        values: [idx],
      }
    }
    return this._metadataTypes[0][idx]
  }

  /**
   * @access package  - Internal implementation detail. Do not use.
   */
  _getApiEntryPoint(name: string, method: string) {
    const idx = this._descriptors.apis[name][method]
    return idx == null ? null : this._metadataTypes[0][idx]
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

  const runtimeWithChecksums$ = connectable(
    combineLatest([chainHead.runtime$, decodedMetadata, descriptors]).pipe(
      map(([x, metadataTypes, descriptors]) =>
        x ? Runtime._create(x, metadataTypes, descriptors) : null,
      ),
    ),
    {
      connector: () => new ReplaySubject(1),
    },
  )
  runtimeWithChecksums$.connect()

  const result = runtimeWithChecksums$.pipe(
    filter((v) => Boolean(v)),
  ) as RuntimeApi
  result.latest = () => firstValueFrom(result)

  return result
}

export interface IsCompatible {
  /**
   * `isCompatible` enables you to check whether or not the call you're trying
   * to make is compatible with the descriptors you generated on dev time.
   * In this case the function waits for `Runtime` to load, and returns
   * asynchronously.
   *
   * @returns Promise that resolves with the result of the compatibility
   *          check.
   */
  (): Promise<boolean>
  /**
   * Passing the runtime makes the function to return synchronously.
   *
   * @returns Result of the compatibility check.
   */
  (runtime: Runtime): boolean
}

export const compatibilityHelper =
  (
    runtimeApi: RuntimeApi,
    getDescriptorEntryPoint: (runtime: Runtime) => EntryPoint | null,
  ) =>
  (getChecksum: (ctx: RuntimeContext) => string | null) => {
    function isCompatibleSync(runtime: Runtime) {
      return getChecksum(runtime._getCtx()) === getDescriptorEntryPoint(runtime)
    }

    const isCompatible: IsCompatible = (runtime?: Runtime): any => {
      if (runtime) {
        return isCompatibleSync(runtime)
      }

      return runtimeApi.latest().then(isCompatibleSync)
    }
    const waitChecksums = async () => {
      const runtime = await runtimeApi.latest()
      return (ctx: RuntimeContext) =>
        getChecksum(ctx) === getDescriptorEntryPoint(runtime)
    }
    const compatibleRuntime$ = (
      chainHead: ChainHead$,
      hash: string | null,
      error: () => Error,
    ) =>
      combineLatest([chainHead.getRuntimeContext$(hash), waitChecksums()]).pipe(
        map(([ctx, isCompatible]) => {
          if (!isCompatible(ctx)) {
            throw error()
          }
          return ctx
        }),
      )

    const withCompatibleRuntime =
      <T>(
        chainHead: ChainHead$,
        mapper: (x: T) => string,
        error: () => Error,
      ) =>
      (source$: Observable<T>): Observable<[T, RuntimeContext]> =>
        combineLatest([
          source$.pipe(chainHead.withRuntime(mapper)),
          waitChecksums(),
        ]).pipe(
          map(([[x, ctx], isCompatible]) => {
            if (!isCompatible(ctx)) {
              throw error()
            }
            return [x, ctx]
          }),
        )

    return {
      isCompatible,
      waitChecksums,
      withCompatibleRuntime,
      compatibleRuntime$,
    }
  }
export type CompatibilityHelper = ReturnType<typeof compatibilityHelper>
