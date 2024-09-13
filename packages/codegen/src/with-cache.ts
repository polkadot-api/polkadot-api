import type { LookupEntry } from "@polkadot-api/metadata-builders"

type FnWithStack<Other extends Array<any>, T> = (
  input: LookupEntry,
  cache: Map<number, T>,
  stack: Set<number>,
  ...rest: Other
) => T

export const withCache =
  <Other extends Array<any>, T>(
    fn: FnWithStack<Other, T>,
    onEnterCircular: (
      cacheGetter: () => T,
      circular: LookupEntry,
      ...rest: Other
    ) => T,
    onExitCircular: (
      outter: T,
      inner: T,
      circular: LookupEntry,
      ...rest: Other
    ) => T,
    saveCircularResult: (result: T) => boolean,
  ): FnWithStack<Other, T> =>
  (input, cache, stack, ...rest) => {
    const { id } = input
    if (cache.has(id)) return cache.get(id)!

    if (stack.has(id)) {
      const res = onEnterCircular(() => cache.get(id)!, input, ...rest)
      if (saveCircularResult(res)) cache.set(id, res)
      return res
    }

    stack.add(id)
    let result = fn(input, cache, stack, ...rest)
    stack.delete(id)

    if (cache.has(id)) {
      result = onExitCircular(result, cache.get(id)!, input, ...rest)
    }

    if (saveCircularResult(result)) cache.set(id, result)

    return result
  }
