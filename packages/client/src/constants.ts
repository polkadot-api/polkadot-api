import { RuntimeContext } from "@polkadot-api/observable-client"
import { CompatibilityFunctions, CompatibilityHelper, Runtime } from "./runtime"

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
  {
    valuesAreCompatible,
    waitDescriptors,
    getCompatibilityLevel,
  }: CompatibilityHelper,
): ConstantEntry<T> => {
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
      const ctx = runtime._getCtx()
      const value = getValueWithContext(ctx)
      if (!valuesAreCompatible(runtime, ctx, value))
        throw new Error(
          `Incompatible runtime entry Constant(${palletName}.${name})`,
        )
      return value
    }
    return waitDescriptors().then(fn)
  }

  return Object.assign(fn, { getCompatibilityLevel })
}
