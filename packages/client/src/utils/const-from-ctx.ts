import { RuntimeContext } from "@polkadot-api/observable-client"

export const constFromCtx = (
  { mappedMeta, dynamicBuilder }: RuntimeContext,
  pallet: string,
  name: string,
) => {
  const constant = mappedMeta.pallets[pallet].const.get(name)
  if (!constant)
    throw new Error(`Runtime entry Constant(${pallet}.${name}) not found`)
  return dynamicBuilder.buildConstant(pallet, name).dec(constant.value)
}
