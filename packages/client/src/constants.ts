import { firstValueFrom, map } from "rxjs"
import { ChainHead$, RuntimeContext } from "@polkadot-api/observable-client"
import { CompatibilityHelper, CompatibilityFunctions, Runtime } from "./runtime"

export interface ConstantEntry<T> extends CompatibilityFunctions {
  /**
   * Constants are simple key-value structures found in the runtime metadata.
   *
   * @returns Promise that will resolve in the value of the constant.
   */
  (): Promise<T>
  /**
   * @param runtime  Runtime from got with `typedApi.runtime`
   * @returns Synchronously returns value of the constant.
   */
  (runtime: Runtime): T
}

export const createConstantEntry = <T>(
  palletName: string,
  name: string,
  chainHead: ChainHead$,
  {
    isCompatible,
    getCompatibilityLevel,
    compatibleRuntime$,
  }: CompatibilityHelper,
): ConstantEntry<T> => {
  const checksumError = () =>
    new Error(`Incompatible runtime entry Constant(${palletName}.${name})`)

  const cachedResults = new WeakMap<RuntimeContext, T>()
  const getValueWithContext = (ctx: RuntimeContext) => {
    if (cachedResults.has(ctx)) {
      return cachedResults.get(ctx)!
    }

    const pallet = ctx.metadata.pallets.find((p) => p.name === palletName)
    const constant = pallet?.constants.find((c) => c.name === name)!
    const result = ctx.dynamicBuilder
      .buildConstant(palletName, name)
      .dec(constant.value)
    cachedResults.set(ctx, result)
    return result
  }

  const fn = (runtime?: Runtime): any => {
    if (runtime) {
      if (!isCompatible(runtime)) throw checksumError()
      return getValueWithContext(runtime._getCtx())
    }
    return firstValueFrom(
      compatibleRuntime$(chainHead, null, checksumError).pipe(
        map(getValueWithContext),
      ),
    )
  }

  return Object.assign(fn, { getCompatibilityLevel })
}
