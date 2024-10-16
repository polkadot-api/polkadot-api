const isResult = (value: unknown) =>
  typeof value === "object" &&
  value &&
  "success" in value &&
  "value" in value &&
  typeof value.success === "boolean"

export type FlattenValues<T> = T extends { success: boolean; value: unknown }
  ? FlattenValues<(T & { success: true })["value"]>
  : T
export const flattenValues = <T extends object>(v: T): FlattenValues<T> =>
  isResult(v) ? (flattenValues as any)((v as any).value) : v

export type FlattenErrors<T> = T extends { success: boolean; value: unknown }
  ?
      | (T & { success: false })["value"]
      | FlattenErrors<(T & { success: true })["value"]>
  : never
export const flattenErrors = <T extends object>(
  v: T,
): { error: FlattenErrors<T> } | null =>
  isResult(v)
    ? (v as any).success
      ? (flattenErrors as any)((v as any).value)
      : {
          error: (v as any).value,
        }
    : null
