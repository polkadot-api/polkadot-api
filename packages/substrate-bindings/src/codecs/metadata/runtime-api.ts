import { Struct, Vector, str } from "scale-ts"
import { docs } from "./docs"
import { compactNumber, Hex, compactNumber as ty } from "../scale"
import { itemDeprecation } from "./deprecation"

export const runtimeApiMethod = {
  name: str,
  inputs: Vector(
    Struct({
      name: str,
      type: ty,
    }),
  ),
  output: ty,
  docs,
}

export const runtimeApiV15 = Struct({
  name: str,
  methods: Vector(Struct(runtimeApiMethod)),
  docs,
})

export const runtimeApi = Struct({
  name: str,
  methods: Vector(
    Struct({ ...runtimeApiMethod, deprecationInfo: itemDeprecation }),
  ),
  docs,
  version: compactNumber,
  deprecationInfo: itemDeprecation,
})

export const viewFunction = Struct({
  id: Hex(32),
  ...runtimeApiMethod,
  deprecationInfo: itemDeprecation,
})
