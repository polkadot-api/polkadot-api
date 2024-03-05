import type { ExtractEnumValue, Enum } from "../codecs"

export type GetEnum<T extends Enum<{ type: string; value: any }>> = {
  [K in T["type"]]: (
    ...args: ExtractEnumValue<T, K> extends undefined
      ? []
      : [value: ExtractEnumValue<T, K>]
  ) => T
}
