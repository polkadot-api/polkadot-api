import { firstValueFromWithSignal, isOptionalArg } from "@/utils"
import { ChainHead$ } from "@polkadot-api/observable-client"
import { fromHex, mergeUint8, toHex } from "@polkadot-api/utils"
import { combineLatest, map, mergeMap } from "rxjs"
import { compactNumber, _void, Enum } from "@polkadot-api/substrate-bindings"
import { PullOptions } from "./types"
import { InOutCompat } from "./compatibility"

type WithCallOptions<Args extends Array<any>> = Args["length"] extends 0
  ? [options?: PullOptions]
  : [...args: Args, options?: PullOptions]

export type ViewFn<Args extends Array<any>, Payload> = {
  /**
   * Get `Payload` (Promise-based) for the view function.
   *
   * @param args  All keys needed for that runtime call.
   *              At the end, optionally set which block to target (latest
   *              known finalized is the default) and an AbortSignal.
   */
  (...args: WithCallOptions<Args>): Promise<Payload>
}

const RUNTIME_NAMESPACE = "RuntimeViewFunction"
const RUNTIME_METHOD = "execute_view_function"
const RUNTIME_CALL_NAME = RUNTIME_NAMESPACE + "_" + RUNTIME_METHOD

export const createViewFnEntry = (
  pallet: string,
  entry: string,
  chainHead: ChainHead$,
  compatibility: InOutCompat,
): ViewFn<any, any> => {
  const compatibilityError = () =>
    new Error(`Incompatible runtime entry ViewFn(${pallet}.${entry})`)

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
        const compat = getCompat(ctx)
        if (!compat.args.isValueCompatible(args)) throw compatibilityError()
        const viewArgs = viewCodec.args.enc(args)
        const arg = mergeUint8([
          fromHex(ctx.mappedMeta.pallets[pallet].view.get(entry)!.id),
          compactNumber.enc(viewArgs.length),
          viewArgs,
        ])

        return chainHead.call$(at, RUNTIME_CALL_NAME, toHex(arg)).pipe(
          map((v) => {
            try {
              const decoded = apiCodec.value.dec(v)
              if (
                !("success" in decoded && "value" in decoded) ||
                (!("type" in decoded.value) &&
                  !(decoded.value instanceof Uint8Array))
              )
                throw null
              return decoded as
                | { success: true; value: Uint8Array }
                | { success: false; value: Enum<any> }
            } catch {
              throw new Error(
                `Unexpected RuntimeCall(${RUNTIME_CALL_NAME}) type`,
              )
            }
          }),
          map(({ success, value }) => {
            if (!success) throw new Error(`ViewFn API Error: ${value.type}`)
            const decoded = viewCodec.value.dec(value)
            if (!compat.value.isValueCompatible(decoded))
              throw compatibilityError()
            return decoded
          }),
        )
      }),
      chainHead.withHodl(at),
    )

    return firstValueFromWithSignal(result$, signal)
  }
}
