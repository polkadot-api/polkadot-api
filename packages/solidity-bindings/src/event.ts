import { toHex } from "@unstoppablejs/utils"
import { Codec, keccak, StringRecord } from "solidity-codecs"
import { Untuple } from "./untuple"

export const solidityEvent = <F extends StringRecord<Codec<any>>, D>(
  filters: F,
  data: Codec<D>,
  name?: string,
) => {
  let signature: string | undefined
  if (name !== undefined) {
    const args = Object.values(filters).map((x) => x.s)
    if (data.s !== "()") args.push(...data.s.slice(1, -1).split(","))
    signature = toHex(keccak(`${name}(${args.join(",")})`))
  }
  const entries = Object.entries(filters)

  const encodeTopics = (
    filter: Partial<{
      [K in keyof F]: F[K] extends Codec<infer V> ? V : unknown
    }>,
  ) => {
    const topics = entries.map(([key, codec]) =>
      filter.hasOwnProperty(key) ? toHex(codec.enc(filter[key])) : null,
    )
    if (signature) topics.unshift(signature)
    return topics
  }

  const decodeFilters = (
    topics: Array<string>,
  ): {
    [K in keyof F]: F[K] extends Codec<infer V> ? V : unknown
  } => {
    const bIdx = signature ? 1 : 0
    return Object.fromEntries(
      entries.map(([key, [, dec]], idx) => [key, dec(topics[idx + bIdx])]),
    ) as any
  }

  return {
    encodeTopics,
    decodeFilters,
    decodeData: Untuple(data[1]),
    name,
  }
}
