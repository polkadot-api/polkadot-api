import { map, mergeMap } from "rxjs"
import { firstValueFromWithSignal } from "@/utils"
import { getObservableClient, RuntimeContext } from "./observableClient"
import { toHex } from "@polkadot-api/utils"

type CallOptions = Partial<{
  at: string
  signal: AbortSignal
}>

type WithCallOptions<Args extends Array<any>> = Args["length"] extends 0
  ? [options?: CallOptions]
  : [...args: Args, options?: CallOptions]

export type RuntimeCall<Args extends Array<any>, Payload> = (
  ...args: WithCallOptions<Args>
) => Promise<Payload>

const isOptionalArg = (lastArg: any) => {
  if (typeof lastArg !== "object") return false

  return Object.keys(lastArg).every(
    (k) =>
      (k === "at" && typeof lastArg.at === "string") ||
      (k === "signal" && lastArg.signal instanceof AbortSignal),
  )
}

export const createRuntimeCallEntry = (
  checksum: string,
  api: string,
  method: string,
  chainHead: ReturnType<ReturnType<typeof getObservableClient>["chainHead$"]>,
): RuntimeCall<any, any> => {
  const callName = `${api}_${method}`
  const checksumCheck = (ctx: RuntimeContext) => {
    const actualChecksum = ctx.checksumBuilder.buildRuntimeCall(api, method)
    if (checksum !== actualChecksum)
      throw new Error(`Incompatible runtime entry RuntimeCall(${callName})`)
  }

  return (...args: Array<any>) => {
    const lastArg = args[args.length - 1]
    const isLastArgOptional = isOptionalArg(lastArg)
    const { signal, at: _at }: CallOptions = isLastArgOptional ? lastArg : {}
    const at = _at ?? null

    const result$ = chainHead.getRuntimeContext$(at).pipe(
      mergeMap((ctx) => {
        checksumCheck(ctx)
        const codecs = ctx.dynamicBuilder.buildRuntimeCall(api, method)
        return chainHead
          .call$(at, callName, toHex(codecs.args.enc(args)))
          .pipe(map(codecs.value.dec))
      }),
    )

    return firstValueFromWithSignal(result$, signal)
  }
}
