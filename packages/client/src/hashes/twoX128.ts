import { h64 } from "./h64"

export const twoX128 = (input: Uint8Array): Uint8Array => {
  const result = new ArrayBuffer(16)
  const dv = new DataView(result)

  dv.setBigUint64(0, h64(input), true)
  dv.setBigUint64(8, h64(input, 1n), true)

  return new Uint8Array(result)
}
