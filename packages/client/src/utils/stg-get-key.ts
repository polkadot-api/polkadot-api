import { RuntimeContext } from "@polkadot-api/observable-client"

export const stgGetKey = (
  ctx: RuntimeContext,
  pallet: string,
  name: string,
  areAgsCompat: (args: Array<any>) => boolean,
) => {
  const getIncompatErr = () =>
    new Error(`Incompatible runtime entry Storage(${pallet}.${name})`)

  let codecs
  try {
    codecs = ctx.dynamicBuilder.buildStorage(pallet, name)
  } catch {
    throw getIncompatErr()
  }

  return (...args: any[]) => {
    if (args.length === codecs.len && !areAgsCompat(args))
      throw getIncompatErr()
    return codecs.keys.enc(...args)
  }
}
