export function mapObject<K extends string | number | symbol, I, O>(
  input: Record<K, I>,
  mapper: (i: I, k: K) => O,
): Record<K, O>

export function mapObject<K extends string | number | symbol, I, O>(
  input: Record<K, I>,
  mapper: (i: I, k?: K) => O,
): Record<K, O> {
  return Object.fromEntries(
    Object.entries(input).map(
      ([key, value]: any) => [key, mapper(value, key)] as const,
    ),
  ) as any
}

export type StringRecord<T> = {
  [Sym: symbol]: never
  [Num: number]: never
  [Str: string]: T
}

export const mapStringRecord = <I, O>(
  input: StringRecord<I>,
  mapper: (value: I, key: string) => O,
): StringRecord<O> =>
  Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key, mapper(value, key)]),
  ) as StringRecord<O>
