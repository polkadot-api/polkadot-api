import {
  IncompatibleRuntimeError,
  InvalidArgsError,
  ValueCompatibility,
} from "@/compatibility"
import { RuntimeContext } from "@polkadot-api/observable-client"
import { mergeUint8 } from "@polkadot-api/utils"

export const getCallData = (
  dynamicBuilder: RuntimeContext["dynamicBuilder"],
  isCompat: (value: any) => ValueCompatibility,
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

  const compatibilityResult = isCompat(arg)
  if (compatibilityResult.type === "incompatible")
    throw new InvalidArgsError(
      "Transaction",
      `${pallet}.${name}`,
      [arg],
      compatibilityResult.value,
    )
  if (compatibilityResult.type === "runtimeIncompatible")
    throw new IncompatibleRuntimeError("Transaction", `${pallet}.${name}`)

  const {
    location,
    codec: [enc],
  } = codecs
  return mergeUint8([new Uint8Array(location), enc(arg)])
}
