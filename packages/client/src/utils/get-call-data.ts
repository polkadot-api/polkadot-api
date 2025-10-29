import { RuntimeContext } from "@polkadot-api/observable-client"
import { mergeUint8 } from "@polkadot-api/utils"

export const getCallData = (
  dynamicBuilder: RuntimeContext["dynamicBuilder"],
  isCompat: (value: any) => boolean,
  pallet: string,
  name: string,
  arg: any,
) => {
  let codecs
  try {
    codecs = dynamicBuilder.buildCall(pallet, name)
  } catch {
    throw new Error(`Runtime entry Tx(${pallet}.${name}) not found`)
  }

  if (!isCompat(arg))
    throw new Error(`Incompatible runtime entry Tx(${pallet}.${name})`)

  const {
    location,
    codec: [enc],
  } = codecs
  return mergeUint8([new Uint8Array(location), enc(arg)])
}
