import { _void, Enum, Option, str, Struct, Tuple, u8, Vector } from "scale-ts"

export const itemDeprecation = Enum({
  NotDeprecated: _void,
  DeprecatedWithoutNote: _void,
  Deprecated: Struct({
    note: str,
    since: Option(str),
  }),
})

export const variantDeprecation = Vector(
  Tuple(
    u8,
    Enum(
      {
        DeprecatedWithoutNote: _void,
        Deprecated: Struct({
          note: str,
          since: Option(str),
        }),
      },
      [1, 2],
    ),
  ),
)
