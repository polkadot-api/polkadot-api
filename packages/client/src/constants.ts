import { PlainDescriptor } from "@polkadot-api/substrate-bindings"
import {
  IsCompatible,
  Runtime,
  createIsCompatible,
  getRuntimeContext,
} from "./runtime"
import { RuntimeContext, getObservableClient } from "./observableClient"
import { filter, firstValueFrom, map } from "rxjs"

export interface ConstantEntry<T> {
  (): Promise<T>
  (runtime: Runtime): T
  isCompatible: IsCompatible
}

export const createConstantEntry = <T>(
  checksum: PlainDescriptor<T>,
  palletName: string,
  name: string,
  chainHead: ReturnType<ReturnType<typeof getObservableClient>["chainHead$"]>,
): ConstantEntry<T> => {
  const hasSameChecksum = (ctx: RuntimeContext) =>
    ctx.checksumBuilder.buildStorage(palletName, name) === checksum

  const cachedResults = new WeakMap<RuntimeContext, T>()
  const getValueWithContext = (ctx: RuntimeContext) => {
    if (cachedResults.has(ctx)) {
      return cachedResults.get(ctx)!
    }

    if (!hasSameChecksum(ctx))
      throw new Error(
        `Incompatible runtime entry Constant(${palletName}.${name})`,
      )

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
      return getValueWithContext(getRuntimeContext(runtime))
    }
    return firstValueFrom(
      chainHead.runtime$.pipe(filter(Boolean), map(getValueWithContext)),
    )
  }
  const isCompatible = createIsCompatible(chainHead, hasSameChecksum)

  return Object.assign(fn, { isCompatible })
}
