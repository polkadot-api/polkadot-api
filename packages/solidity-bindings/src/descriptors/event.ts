import { toHex } from "@unstoppablejs/utils"
import { Codec, Decoder, keccak, StringRecord } from "solidity-codecs"
import { Untuple, UntupleFn } from "../utils"

export type EventFilter<T extends StringRecord<Codec<any>>> = {
  [K in keyof T]: T[K] extends Codec<infer V> ? V : unknown
}

export interface SolidityEvent<
  F extends StringRecord<Codec<any>>,
  O,
  N extends string,
> {
  encodeTopics: (filter: Partial<EventFilter<F>>) => Array<string | null>
  decodeData: Decoder<Untuple<O>>
  decodeFilters: (topics: Array<string>) => EventFilter<F>
  name?: N
}

export const solidityEvent = <
  F extends StringRecord<Codec<any>>,
  O,
  N extends string,
>(
  filters: F,
  data: Codec<O>,
  name?: N,
): SolidityEvent<F, O, N> => {
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
    decodeData: UntupleFn(data[1]),
    name,
  }
}
