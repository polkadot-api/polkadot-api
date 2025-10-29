import { firstValueFromWithSignal, isOptionalArg } from "@/utils"
import { ChainHead$ } from "@polkadot-api/observable-client"
import { toHex } from "@polkadot-api/utils"
import { map, mergeMap, combineLatest } from "rxjs"
import { PullOptions } from "./types"
import { InOutCompat } from "./compatibility"

type WithCallOptions<Args extends Array<any>> = Args["length"] extends 0
  ? [options?: PullOptions]
  : [...args: Args, options?: PullOptions]

export type RuntimeCall<Args extends Array<any>, Payload> = {
  /**
   * Get `Payload` (Promise-based) for the runtime call.
   *
   * @param args  All keys needed for that runtime call.
   *              At the end, optionally set which block to target (latest
   *              known finalized is the default) and an AbortSignal.
   */
  (...args: WithCallOptions<Args>): Promise<Payload>
}

export const createRuntimeCallEntry = (
  api: string,
  method: string,
  chainHead: ChainHead$,
  compatibility: InOutCompat,
): RuntimeCall<any, any> => {
  const callName = `${api}_${method}`
  const compatibilityError = () =>
    new Error(`Incompatible runtime entry RuntimeCall(${callName})`)

  return (...args: Array<any>) => {
    const lastArg = args[args.length - 1]
    const isLastArgOptional = isOptionalArg(lastArg)
    const { signal, at: _at }: PullOptions = isLastArgOptional ? lastArg : {}
    const at = _at ?? null

    const result$ = combineLatest([
      chainHead.getRuntimeContext$(at),
      compatibility,
    ]).pipe(
      mergeMap(([ctx, getCompat]) => {
        let codecs
        try {
          codecs = ctx.dynamicBuilder.buildRuntimeCall(api, method)
        } catch {
          throw new Error(`Runtime entry RuntimeCall(${callName}) not found`)
        }
        const compat = getCompat(ctx)
        if (!compat.args.isValueCompatible(args)) throw compatibilityError()
        return chainHead.call$(at, callName, toHex(codecs.args.enc(args))).pipe(
          map(codecs.value.dec),
          map((value) => {
            if (!compat.value.isValueCompatible(value))
              throw compatibilityError()
            return value
          }),
        )
      }),
      chainHead.withHodl(at),
    )

    return firstValueFromWithSignal(result$, signal)
  }
}
