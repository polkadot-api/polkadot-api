export function filterObject<K extends string | number | symbol, I>(
  input: Record<K, I>,
  filterFn: (i: I, k: K) => boolean,
): Record<K, I> {
  return Object.fromEntries(
    Object.entries(input).filter(([key, value]: any) => filterFn(value, key)),
  ) as any
}
