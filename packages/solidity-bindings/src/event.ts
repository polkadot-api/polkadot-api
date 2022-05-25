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
    const dataS = data.s
    const raw = `${name}(${[
      ...Object.values(filters).map((x) => x.s),
      dataS.slice(1),
    ].join(",")}`
    signature = toHex(keccak(raw))
  }

  const encodeTopics = (filter: {
    [K in keyof F]: F[K] extends Codec<infer V> ? V : unknown
  }) => {
    const topics = Object.entries(filters).map(([key, codec]) =>
      filter.hasOwnProperty(key) ? toHex(codec.enc(filter[key])) : null,
    )
    if (signature) topics.unshift(signature)
    return topics
  }

  return {
    encodeTopics,
    decodeData: Untuple(data[1]),
    name,
  }
}
