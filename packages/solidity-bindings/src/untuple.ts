import { Decoder, enhanceDecoder } from "solidity-codecs"

export type Untuple<T> = T extends [infer V] ? V : T extends [] ? void : T

const isSingle = (signature: string): boolean | null => {
  if (signature === "()") return null
  if (!signature.startsWith("(")) return false
  let idx = 1
  let level = 1
  do {
    const c = signature[idx++]
    if (level === 1 && c === ",") return false
    if (c === "(") {
      level++
    } else if (c === ")") {
      level--
    }
  } while (level > 0 && idx < signature.length)
  return level === 0
}

export const Untuple = <T>(base: Decoder<T>): Decoder<Untuple<T>> => {
  const single = isSingle(base.s)
  return enhanceDecoder(base, (x) => {
    if (single === null) return void 0
    return single ? (x as any)[0] : x
  }) as any
}
