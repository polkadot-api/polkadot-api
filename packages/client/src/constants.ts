import { type ChainHead$ } from "@polkadot-api/observable-client"
import { combineLatest, map } from "rxjs"
import { type PullOptions } from "./types"
import { firstValueFromWithSignal } from "./utils"
import { constFromCtx } from "./utils/const-from-ctx"
import { ValueCompat } from "./compatibility"

export type ConstantEntry<T> = {
  /**
   * Constants are simple key-value structures found in the runtime metadata.
   *
   * @returns Promise that will resolve in the value of the constant.
   */
  (options?: PullOptions): Promise<T>
}

export const createConstantEntry =
  <T>(
    pallet: string,
    name: string,
    chainHead: ChainHead$,
    getCompat: ValueCompat,
  ): ConstantEntry<T> =>
  ({ at, signal } = {}): Promise<T> =>
    firstValueFromWithSignal(
      combineLatest([chainHead.getRuntimeContext$(at || null), getCompat]).pipe(
        map(([ctx, compat]) => {
          const value = constFromCtx(ctx, pallet, name)
          if (compat(ctx).isValueCompatible(value)) return value
          throw new Error(`Incompatible entry Const(${pallet}.${name})`)
        }),
      ),
      signal,
    )
