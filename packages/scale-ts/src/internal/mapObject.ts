export function mapObject<K extends string | number | symbol, I, O>(
  input: Record<K, I>,
  mapper: (i: I, k: K) => O,
): Record<K, O>

export function mapObject<K extends string | number | symbol, I, O>(
  input: Record<K, I>,
  mapper: (i: I, k?: K) => O,
): Record<K, O> {
  const keys = Object.keys(input) as Array<K>
  const len = keys.length

  const result: Record<K, O> = {} as any
  for (let i = 0; i < len; i++) {
    const key = keys[i]
    result[key] = mapper(input[key], key)
  }

  return result
}
