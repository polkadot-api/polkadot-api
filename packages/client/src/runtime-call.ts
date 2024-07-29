import { firstValueFromWithSignal, isOptionalArg } from "@/utils"
import { ChainHead$ } from "@polkadot-api/observable-client"
import { toHex } from "@polkadot-api/utils"
import { map, mergeMap } from "rxjs"
import { CompatibilityFunctions, CompatibilityHelper } from "./compatibility"

type CallOptions = Partial<{
  at: string
  signal: AbortSignal
}>

type WithCallOptions<Args extends Array<any>> = Args["length"] extends 0
  ? [options?: CallOptions]
  : [...args: Args, options?: CallOptions]

export interface RuntimeCall<D, Args extends Array<any>, Payload>
  extends CompatibilityFunctions<D> {
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
  {
    isCompatible,
    getCompatibilityLevel,
    compatibleRuntime$,
    argsAreCompatible,
    valuesAreCompatible,
  }: CompatibilityHelper,
): RuntimeCall<any, any, any> => {
  const callName = `${api}_${method}`
  const compatibilityError = () =>
    new Error(`Incompatible runtime entry RuntimeCall(${callName})`)

  const fn = (...args: Array<any>) => {
    const lastArg = args[args.length - 1]
    const isLastArgOptional = isOptionalArg(lastArg)
    const { signal, at: _at }: CallOptions = isLastArgOptional ? lastArg : {}
    const at = _at ?? null

    const result$ = compatibleRuntime$(chainHead, at).pipe(
      mergeMap(([runtime, ctx]) => {
        if (!argsAreCompatible(runtime, ctx, args)) throw compatibilityError()
        const codecs = ctx.dynamicBuilder.buildRuntimeCall(api, method)
        return chainHead.call$(at, callName, toHex(codecs.args.enc(args))).pipe(
          map(codecs.value.dec),
          map((value) => {
            if (!valuesAreCompatible(runtime, ctx, value))
              throw compatibilityError()
            return value
          }),
        )
      }),
    )

    return firstValueFromWithSignal(result$, signal)
  }

  return Object.assign(fn, { getCompatibilityLevel, isCompatible })
}
