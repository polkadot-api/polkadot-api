import { IncompatibleRuntimeError, InvalidArgsError } from "@/compatibility"
import { RuntimeContext } from "@polkadot-api/observable-client"

export const stgGetKey = (
  ctx: RuntimeContext,
  pallet: string,
  name: string,
  areAgsCompat: (args: Array<any>) => boolean,
) => {
  let codecs
  try {
    codecs = ctx.dynamicBuilder.buildStorage(pallet, name)
  } catch {
    throw new IncompatibleRuntimeError("Storage", `${pallet}.${name}`)
  }

  return (...args: any[]) => {
    if (args.length === codecs.len && !areAgsCompat(args))
      throw new InvalidArgsError("Storage", `${pallet}.${name}`, args)
    return codecs.keys.enc(...args)
  }
}
