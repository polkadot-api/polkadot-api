export const withWeakCache = <In, Out>(
  fn: (input: In) => Out,
): ((input: In) => Out) => {
  const cache = new WeakMap<any, Out>()
  const notin = {} as unknown as In
  return (input) => {
    const key = input == null ? notin : input
    const result = cache.get(key) || fn(input)
    cache.set(key, result)
    return result
  }
}
