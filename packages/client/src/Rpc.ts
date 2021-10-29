import type { Client } from "./client"

export const Rpc = (pallet: string, client: Client) => {
  function rpcCall<ARGS extends Array<any> = [], IT = any, OT = any>(
    item: string,
    mapFn: (x: IT) => OT,
  ): (
    ...args: [...ARGS] | [...args: ARGS, abortSignal: AbortSignal]
  ) => Promise<OT>

  function rpcCall<T, ARGS extends Array<any> = []>(
    item: string,
  ): (
    ...args: [...ARGS] | [...args: ARGS, abortSignal: AbortSignal]
  ) => Promise<T>

  function rpcCall<ARGS extends Array<any> = [], IT = any, OT = any>(
    item: string,
    mapFn: (x: IT) => OT = (x: IT) => x as unknown as OT,
  ) {
    const method = `${pallet}_${item}`

    return (...args: [...ARGS] | [...args: ARGS, abortSignal: AbortSignal]) =>
      new Promise<OT>((res, rej) => {
        const lastArg = args[args.length - 1]
        const [innerArgs, signal]: [ARGS, AbortSignal | undefined] = (
          lastArg instanceof AbortSignal
            ? [args.slice(0, -1), lastArg]
            : [args, undefined]
        ) as any

        let active = true
        function onAbort() {
          signal!.removeEventListener("abort", onAbort)
          cb()
          rej(new Error("Aborted Promise!"))
        }
        const cb = client.request<IT>(method, innerArgs, (data) => {
          active = false
          signal?.removeEventListener("abort", onAbort)

          try {
            res(mapFn(data))
          } catch (e) {
            rej(e)
          }
        })

        if (signal && active) signal.addEventListener("abort", onAbort)
      })
  }
  return rpcCall
}
