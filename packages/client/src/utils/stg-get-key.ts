import {
  IncompatibleRuntimeError,
  InvalidArgsError,
  ValueCompatibility,
} from "@/compatibility"
import { RuntimeContext } from "@polkadot-api/observable-client"

export const stgGetKey = (
  ctx: RuntimeContext,
  pallet: string,
  name: string,
  getArgsCompatibility: (args: Array<any>) => ValueCompatibility,
) => {
  let codecs
  try {
    codecs = ctx.dynamicBuilder.buildStorage(pallet, name)
  } catch {
    throw new Error(`Runtime entry Storage(${pallet}.${name}) not found`)
  }

  return (...args: any[]) => {
    if (args.length === codecs.len) {
      const compatibilityResult = getArgsCompatibility(args)
      if (compatibilityResult.type === "incompatible")
        throw new InvalidArgsError(
          "Storage",
          `${pallet}.${name}`,
          args,
          compatibilityResult.value,
        )
      if (compatibilityResult.type === "runtimeIncompatible")
        throw new IncompatibleRuntimeError("Storage", `${pallet}.${name}`)
    }
    return codecs.keys.enc(...args)
  }
}
