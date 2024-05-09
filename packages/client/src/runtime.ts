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
import { DescriptorsValue } from "./descriptors"

export enum OpType {
  Storage = 0,
  Tx = 1,
  Event = 2,
  Error = 3,
  Const = 4,
}

export class Runtime {
  private constructor(
    private _ctx: RuntimeContext,
    private _checksums: string[],
    private _descriptors: DescriptorsValue,
  ) {}

  /**
   * Internal implementation detail. Do not use
   */
  static _create(
    ctx: RuntimeContext,
    checksums: string[],
    descriptors: DescriptorsValue,
  ) {
    return new Runtime(ctx, checksums, descriptors)
  }

  /**
   * Internal implementation detail. Do not use
   */
  _getCtx() {
    return this._ctx
  }

  /**
   * Internal implementation detail. Do not use
   */
  _getPalletChecksum(opType: OpType, pallet: string, name: string) {
    return this._checksums[this._descriptors.pallets[pallet][opType][name]]
  }

  /**
   * Internal implementation detail. Do not use
   */
  _getApiChecksum(name: string, method: string) {
    return this._checksums[this._descriptors.apis[name][method]]
  }
}

export type RuntimeApi = Observable<Runtime> & {
  latest: () => Promise<Runtime>
}

export const getRuntimeApi = (
  checksums: Promise<string[]>,
  descriptors: Promise<DescriptorsValue>,
  chainHead: ReturnType<ReturnType<typeof getObservableClient>["chainHead$"]>,
): RuntimeApi => {
  const runtimeWithChecksums$ = connectable(
    combineLatest([chainHead.runtime$, checksums, descriptors]).pipe(
      map(([x, checksums, descriptors]) =>
        x ? Runtime._create(x, checksums, descriptors) : null,
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
  (): Promise<boolean>
  (runtime: Runtime): boolean
}

export const compatibilityHelper =
  (
    runtimeApi: RuntimeApi,
    getDescriptorChecksum: (runtime: Runtime) => string,
  ) =>
  (getChecksum: (ctx: RuntimeContext) => string | null) => {
    function isCompatibleSync(runtime: Runtime) {
      return getChecksum(runtime._getCtx()) === getDescriptorChecksum(runtime)
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
        getChecksum(ctx) === getDescriptorChecksum(runtime)
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
