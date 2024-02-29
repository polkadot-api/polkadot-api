import { Observable, filter, firstValueFrom, map } from "rxjs"
import { RuntimeContext, getObservableClient } from "./observableClient"

export class Runtime {
  protected _ctx: unknown

  private constructor(ctx: RuntimeContext) {
    this._ctx = ctx
  }
}
export function getRuntimeContext(runtime: Runtime): RuntimeContext {
  return (runtime as any)._ctx
}
const createRuntime = (ctx: RuntimeContext) => new (Runtime as any)(ctx)

export type RuntimeApi = Observable<Runtime> & {
  latest: () => Promise<Runtime>
}

export const getRuntimeApi = (
  chainHead: ReturnType<ReturnType<typeof getObservableClient>["chainHead$"]>,
): RuntimeApi => {
  let latestRuntime: Promise<Runtime>
  let resolve: ((r: Runtime) => void) | null = null

  latestRuntime = new Promise<Runtime>((res) => {
    resolve = res
  })

  chainHead.runtime$.subscribe((x) => {
    if (x) {
      if (resolve) {
        resolve(createRuntime(x))
        resolve = null
      } else {
        latestRuntime = Promise.resolve(createRuntime(x))
      }
    } else if (!resolve) {
      latestRuntime = new Promise<Runtime>((res) => {
        resolve = res
      })
    }
  })

  const result = chainHead.runtime$.pipe(
    filter(Boolean),
    map((x) => createRuntime(x)),
  ) as RuntimeApi
  result.latest = () => latestRuntime

  return result
}

export interface IsCompatible {
  (): Promise<boolean>
  (runtime: Runtime): boolean
}
export function createIsCompatible(
  chainHead: ReturnType<ReturnType<typeof getObservableClient>["chainHead$"]>,
  cb: (ctx: RuntimeContext) => boolean,
): IsCompatible {
  return (runtime?: Runtime): any => {
    if (runtime) {
      return cb(getRuntimeContext(runtime))
    }

    return firstValueFrom(chainHead.runtime$.pipe(filter(Boolean), map(cb)))
  }
}
