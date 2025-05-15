import { Hex, compactNumber } from "@/codecs/scale"
import { Struct, Option, Vector, u8, str, Enum, _void } from "scale-ts"
import { docs } from "./docs"
import { itemDeprecation, variantDeprecation } from "./deprecation"
import { viewFunction } from "./runtime-api"

const hashType = Enum({
  Blake2128: _void,
  Blake2256: _void,
  Blake2128Concat: _void,
  Twox128: _void,
  Twox256: _void,
  Twox64Concat: _void,
  Identity: _void,
})

const hashers = Vector(hashType)

export const storageMap = Struct({
  hashers,
  key: compactNumber,
  value: compactNumber,
})

const storageItem = {
  name: str,
  modifier: u8,
  type: Enum({
    plain: compactNumber,
    map: storageMap,
  }),
  fallback: Hex(),
  docs,
}

const enumRefV14 = Option(compactNumber)

export const v14Pallet = {
  name: str,
  storage: Option(
    Struct({
      prefix: str,
      items: Vector(Struct(storageItem)),
    }),
  ),
  calls: enumRefV14,
  events: enumRefV14,
  constants: Vector(
    Struct({
      name: str,
      type: compactNumber,
      value: Hex(),
      docs,
    }),
  ),
  errors: enumRefV14,
  index: u8,
}

export const v15Pallet = {
  ...v14Pallet,
  docs,
}

const enumRef = Option(
  Struct({ type: compactNumber, deprecationInfo: variantDeprecation }),
)

export const v16Pallet = {
  name: str,
  storage: Option(
    Struct({
      prefix: str,
      items: Vector(
        Struct({
          ...storageItem,
          deprecationInfo: itemDeprecation,
        }),
      ),
    }),
  ),
  calls: enumRef,
  events: enumRef,
  constants: Vector(
    Struct({
      name: str,
      type: compactNumber,
      value: Hex(),
      docs,
      deprecationInfo: itemDeprecation,
    }),
  ),
  errors: enumRef,
  associatedTypes: Vector(
    Struct({
      name: str,
      type: compactNumber,
      docs,
    }),
  ),
  viewFns: Vector(viewFunction),
  index: u8,
  docs,
  deprecationInfo: itemDeprecation,
}
