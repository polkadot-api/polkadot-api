import { firstValueFromWithSignal, isOptionalArg } from "@/utils"
import { ChainHead$ } from "@polkadot-api/observable-client"
import { fromHex, mergeUint8, toHex } from "@polkadot-api/utils"
import { map, mergeMap } from "rxjs"
import { CompatibilityFunctions, CompatibilityHelper } from "./compatibility"
import { compactNumber, _void } from "@polkadot-api/substrate-bindings"

type CallOptions = Partial<{
  at: string
  signal: AbortSignal
}>

type WithCallOptions<Args extends Array<any>> = Args["length"] extends 0
  ? [options?: CallOptions]
  : [...args: Args, options?: CallOptions]

export type ViewFn<Unsafe, D, Args extends Array<any>, Payload> = {
  /**
   * Get `Payload` (Promise-based) for the view function.
   *
   * @param args  All keys needed for that runtime call.
   *              At the end, optionally set which block to target (latest
   *              known finalized is the default) and an AbortSignal.
   */
  (...args: WithCallOptions<Args>): Promise<Payload>
} & (Unsafe extends true ? {} : CompatibilityFunctions<D>)

const RUNTIME_NAMESPACE = "RuntimeViewFunction"
const RUNTIME_METHOD = "execute_view_function"
const RUNTIME_CALL_NAME = RUNTIME_NAMESPACE + "_" + RUNTIME_METHOD

export const createViewFnEntry = (
  pallet: string,
  entry: string,
  chainHead: ChainHead$,
  {
    isCompatible,
    getCompatibilityLevel,
    compatibleRuntime$,
    argsAreCompatible,
    valuesAreCompatible,
  }: CompatibilityHelper,
): ViewFn<any, any, any, any> => {
  const compatibilityError = () =>
    new Error(`Incompatible runtime entry ViewFn(${pallet}.${entry})`)

  const fn = (...args: Array<any>) => {
    const lastArg = args[args.length - 1]
    const isLastArgOptional = isOptionalArg(lastArg)
    const { signal, at: _at }: CallOptions = isLastArgOptional ? lastArg : {}
    const at = _at ?? null

    const result$ = compatibleRuntime$(chainHead, at).pipe(
      mergeMap(([runtime, ctx]) => {
        let apiCodec
        try {
          apiCodec = ctx.dynamicBuilder.buildRuntimeCall(
            RUNTIME_NAMESPACE,
            RUNTIME_METHOD,
          )
        } catch {
          throw new Error(
            `Runtime entry RuntimeCall(${RUNTIME_CALL_NAME}) not found`,
          )
        }
        let viewCodec
        try {
          viewCodec = ctx.dynamicBuilder.buildViewFn(pallet, entry)
        } catch {
          throw new Error(`Runtime entry ViewFn(${pallet}.${entry}) not found`)
        }
        if (!argsAreCompatible(runtime, ctx, args)) throw compatibilityError()
        const viewArgs = viewCodec.args.enc(args)
        const arg = mergeUint8(
          fromHex(
            ctx.lookup.metadata.pallets
              .find(({ name }) => name === pallet)!
              .viewFns.find(({ name }) => name === entry)!.id,
          ),
          compactNumber.enc(viewArgs.length),
          viewArgs,
        )

        return chainHead.call$(at, RUNTIME_CALL_NAME, toHex(arg)).pipe(
          map((v) => {
            try {
              const decoded = apiCodec.value.dec(v)
              if (
                !("success" in decoded && "value" in decoded) ||
                (!("type" in decoded.value) && !("asBytes" in decoded.value))
              )
                throw null
              return decoded
            } catch {
              throw new Error(
                `Unexpected RuntimeCall(${RUNTIME_CALL_NAME}) type`,
              )
            }
          }),
          map(({ success, value }) => {
            if (!success) throw new Error(`ViewFn API Error: ${value.type}`)
            const decoded = viewCodec.value.dec(value.asBytes())
            if (!valuesAreCompatible(runtime, ctx, decoded))
              throw compatibilityError()
            return decoded
          }),
        )
      }),
    )

    return firstValueFromWithSignal(result$, signal)
  }

  return Object.assign(fn, { getCompatibilityLevel, isCompatible })
}
