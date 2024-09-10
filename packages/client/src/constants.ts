import { RuntimeContext } from "@polkadot-api/observable-client"
import {
  CompatibilityFunctions,
  CompatibilityHelper,
  CompatibilityToken,
  getCompatibilityApi,
} from "./compatibility"

export interface ConstantEntry<D, T> extends CompatibilityFunctions<D> {
  /**
   * Constants are simple key-value structures found in the runtime metadata.
   *
   * @returns Promise that will resolve in the value of the constant.
   */
  (): Promise<T>
  /**
   * @param compatibilityToken  Token from got with `await
   *                            typedApi.compatibilityToken`
   * @returns Synchronously returns value of the constant.
   */
  (compatibilityToken: CompatibilityToken): T
}

export const createConstantEntry = <D, T>(
  palletName: string,
  name: string,
  {
    valuesAreCompatible,
    waitDescriptors,
    isCompatible,
    getCompatibilityLevel,
  }: CompatibilityHelper,
): ConstantEntry<D, T> => {
  const cachedResults = new WeakMap<RuntimeContext, T>()
  const getValueWithContext = (ctx: RuntimeContext) => {
    if (cachedResults.has(ctx)) {
      return cachedResults.get(ctx)!
    }

    const pallet = ctx.lookup.metadata.pallets.find(
      (p) => p.name === palletName,
    )
    const constant = pallet?.constants.find((c) => c.name === name)
    if (constant == null)
      throw new Error(`Runtime entry Constant(${palletName}.${name}) not found`)
    const result = ctx.dynamicBuilder
      .buildConstant(palletName, name)
      .dec(constant.value)
    cachedResults.set(ctx, result)
    return result
  }

  const fn = (compatibilityToken?: CompatibilityToken): any => {
    if (compatibilityToken) {
      const ctx = getCompatibilityApi(compatibilityToken).runtime()
      const value = getValueWithContext(ctx)
      if (!valuesAreCompatible(compatibilityToken, ctx, value))
        throw new Error(
          `Incompatible runtime entry Constant(${palletName}.${name})`,
        )
      return value
    }
    return waitDescriptors().then(fn)
  }

  return Object.assign(fn, { isCompatible, getCompatibilityLevel })
}
