import { Observable, combineLatest, filter, map } from "rxjs"
import {
  ChainHead$,
  RuntimeContext,
  getObservableClient,
} from "@polkadot-api/observable-client"

export class Runtime {
  protected _ctx: unknown
  protected _checksums: string[]

  private constructor(ctx: RuntimeContext, checksums: string[]) {
    this._ctx = ctx
    this._checksums = checksums
  }
}
export function getRuntimeContext(runtime: Runtime): RuntimeContext {
  return (runtime as any)._ctx
}
function getImportedChecksum(runtime: Runtime, idx: number): string {
  return (runtime as any)._checksums[idx]
}
const createRuntime = (ctx: RuntimeContext, checksums: string[]) =>
  new (Runtime as any)(ctx, checksums)

export type RuntimeApi = Observable<Runtime> & {
  latest: () => Promise<Runtime>
}

export const getRuntimeApi = (
  checksums: Promise<string[]>,
  chainHead: ReturnType<ReturnType<typeof getObservableClient>["chainHead$"]>,
): RuntimeApi => {
  let latestRuntime: Promise<Runtime>
  let resolve: ((r: Runtime) => void) | null = null

  latestRuntime = new Promise<Runtime>((res) => {
    resolve = res
  })

  const runtimeWithChecksums$ = combineLatest([chainHead.runtime$, checksums])
  runtimeWithChecksums$.subscribe(([x, checksums]) => {
    if (x) {
      if (resolve) {
        resolve(createRuntime(x, checksums))
        resolve = null
      } else {
        latestRuntime = Promise.resolve(createRuntime(x, checksums))
      }
    } else if (!resolve) {
      latestRuntime = new Promise<Runtime>((res) => {
        resolve = res
      })
    }
  })

  const result = runtimeWithChecksums$.pipe(
    filter(([x]) => Boolean(x)),
    map(([x, checksums]) => createRuntime(x!, checksums)),
  ) as RuntimeApi
  result.latest = () => latestRuntime

  return result
}

export interface IsCompatible {
  (): Promise<boolean>
  (runtime: Runtime): boolean
}

export const compatibilityHelper =
  (runtimeApi: RuntimeApi, checksumIdx: number) =>
  (getChecksum: (ctx: RuntimeContext) => string | null) => {
    function isCompatibleSync(runtime: Runtime) {
      const ctx = getRuntimeContext(runtime)
      const checksum = getImportedChecksum(runtime, checksumIdx)
      return getChecksum(ctx) === checksum
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
        getChecksum(ctx) === getImportedChecksum(runtime, checksumIdx)
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
