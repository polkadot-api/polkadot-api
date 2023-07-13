import { Enum, Struct, u32, _void } from "@unstoppablejs/substrate-codecs"
import { v14 } from "./v14"

export const metadata = Struct({
  foo: u32,
  magicNumber: u32,
  metadata: Enum({
    v0: _void,
    v1: _void,
    v2: _void,
    v3: _void,
    v4: _void,
    v5: _void,
    v6: _void,
    v7: _void,
    v8: _void,
    v9: _void,
    v10: _void,
    v11: _void,
    v12: _void,
    v13: _void,
    v14,
  }),
})
