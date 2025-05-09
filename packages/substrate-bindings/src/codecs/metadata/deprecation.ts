import { _void, Enum, Option, str, Struct, u8, Vector } from "scale-ts"

export const itemDeprecation = Enum({
  NotDeprecated: _void,
  DeprecatedWithoutNote: _void,
  Deprecated: Struct({
    note: str,
    since: Option(str),
  }),
})

export const variantDeprecation = Vector(
  Struct({
    index: u8,
    deprecation: Enum(
      {
        DeprecatedWithoutNote: _void,
        Deprecated: Struct({
          note: str,
          since: Option(str),
        }),
      },
      [1, 2],
    ),
  }),
)
