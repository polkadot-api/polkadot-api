import { Binary } from "@polkadot-api/substrate-bindings"

/**
 * Meant to be used with JSON.stringify.
 *
 * @example
 *
 *   import { jsonSerialize } from "polkadot-api/utils"
 *
 *   JSON.stringify(value, jsonSerialize, 2)
 *
 */
export const jsonSerialize: (this: any, key: string, value: any) => any = (
  _,
  v,
) =>
  typeof v === "bigint"
    ? `${v}n`
    : v != null && v instanceof Uint8Array
      ? Binary.toHex(v)
      : v

/**
 * Meant to be used with JSON.parse.
 *
 * @example
 *
 *   import { jsonDeserialize } from "polkadot-api/utils"
 *
 *   JSON.parse(text, jsonDeserialize)
 *
 */
export const jsonDeserialize: (this: any, key: string, value: any) => any = (
  _,
  v,
) => {
  if (typeof v === "string") {
    // this has no conflicts in papi objects.
    if (/^[0-9]+n$/.test(v)) v = BigInt(v.slice(0, -1))
  }
  return v
}

export * from "@polkadot-api/utils"
