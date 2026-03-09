import { CompatHelpers } from "@/compatibility"
import { PullOptions } from "@/types"
import { createProxyPath, firstValueFromWithSignal } from "@/utils"
import { constFromCtx } from "@/utils/const-from-ctx"
import { getCallData } from "@/utils/get-call-data"
import { stgGetKey } from "@/utils/stg-get-key"
import { ChainHead$, RuntimeContext } from "@polkadot-api/observable-client"
import { mergeMap, Observable } from "rxjs"
import { createTxEntry, Transaction } from "./tx"
import { withWeakCache } from "./utils/with-weak-cache"

export const createStaticApis = (
  chainHead: ChainHead$,
  broadcast$: (tx: Uint8Array) => Observable<never>,
  { getClientCompat, getSyncHelpers, getIsAsssetCompat }: CompatHelpers,
) => {
  const txFromCallData =
    ({ dynamicBuilder, lookup }: RuntimeContext) =>
    (callData: Uint8Array): Transaction => {
      try {
        const {
          type: pallet,
          value: { type: name, value: args },
        } = dynamicBuilder.buildDefinition(lookup.call!).dec(callData)

        return createTxEntry(
          pallet,
          name,
          chainHead,
          broadcast$,
          getClientCompat("tx", pallet, name),
          getIsAsssetCompat,
        )(args)
      } catch {
        throw new Error("Invalid call data")
      }
    }

  return ({ at, signal }: PullOptions = {}) =>
    firstValueFromWithSignal(
      chainHead.getRuntimeContext$(at ?? null).pipe(
        mergeMap(
          withWeakCache(async (ctx) => {
            const compat = await getSyncHelpers(ctx)
            return {
              id: ctx.codeHash,
              txFromCallData: txFromCallData(ctx),
              constants: createProxyPath((pallet, name) =>
                constFromCtx(ctx, pallet, name),
              ),
              query: createProxyPath((pallet, name) => ({
                getKey: stgGetKey(
                  ctx,
                  pallet,
                  name,
                  compat.query[pallet][name].args.isValueCompatible,
                ),
              })),
              tx: createProxyPath((pallet, name) => ({
                getCallData: (arg: any) =>
                  getCallData(
                    ctx.dynamicBuilder,
                    compat.tx[pallet][name].isValueCompatible,
                    pallet,
                    name,
                    arg,
                  ),
              })),
              compat,
            }
          }),
        ),
      ),
      signal,
    )
}
