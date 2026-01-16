import { CompatSyncHelpers } from "@/compatibility"
import { PullOptions } from "@/types"
import { createProxyPath, firstValueFromWithSignal } from "@/utils"
import { constFromCtx } from "@/utils/const-from-ctx"
import { getCallData } from "@/utils/get-call-data"
import { stgGetKey } from "@/utils/stg-get-key"
import { ChainHead$, RuntimeContext } from "@polkadot-api/observable-client"
import { mergeMap } from "rxjs"
import { withWeakCache } from "./utils/with-weak-cache"

const decodeCallData =
  ({ dynamicBuilder, lookup }: RuntimeContext) =>
  (callData: Uint8Array): { pallet: string; name: string; input: any } => {
    try {
      const {
        type: pallet,
        value: { type: name, value: input },
      } = dynamicBuilder.buildDefinition(lookup.call!).dec(callData)

      return { pallet, name, input }
    } catch {
      throw new Error("Invalid call data")
    }
  }

export const createStaticApis =
  (
    getRuntimeContext: ChainHead$["getRuntimeContext$"],
    getCompat: CompatSyncHelpers,
  ) =>
  ({ at, signal }: PullOptions = {}) =>
    firstValueFromWithSignal(
      getRuntimeContext(at ?? null).pipe(
        mergeMap(
          withWeakCache(async (ctx) => {
            const compat = await getCompat(ctx)
            return {
              id: ctx.codeHash,
              decodeCallData: decodeCallData(ctx),
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
