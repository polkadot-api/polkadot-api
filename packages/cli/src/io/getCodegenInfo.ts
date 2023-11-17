import { Data } from "@/data"
import { V14 } from "@polkadot-api/substrate-bindings"
import {
  CodeDeclarations,
  getChecksumBuilder,
  getLookupFn,
  getStaticBuilder,
} from "@polkadot-api/substrate-codegen"
import { PalletData } from "./types"

export const getCodegenInfo = (
  metadata: V14,
  input: Data["descriptorData"],
) => {
  const declarations: CodeDeclarations = {
    imports: new Set<string>(),
    variables: new Map(),
  }

  const descriptorsData: Record<string, PalletData> = {}
  const getLookup = getLookupFn(metadata.lookup)

  const getEnumEntry = (id: number | undefined | void): Array<string> => {
    if (!id) return []
    const lookup = getLookup(id)
    if (lookup.type !== "enum") return []
    return Object.keys(lookup.value)
  }

  const staticBuilder = getStaticBuilder(metadata, declarations)
  const checksumBuilder = getChecksumBuilder(metadata)

  for (const pallet of metadata.pallets) {
    const inputPallet = input[pallet.name]
    if (!inputPallet) continue

    const result: PalletData = {
      constants: {},
      errors: {},
      events: {},
      storage: {},
      tx: {},
    }
    descriptorsData[pallet.name] = result

    for (const stg of pallet.storage?.items ?? []) {
      if (!inputPallet.storage[stg.name]) continue

      const { key, val } = staticBuilder.buildStorage(pallet.name, stg.name)
      result.storage[stg.name] = {
        checksum: checksumBuilder.buildStorage(pallet.name, stg.name)!,
        payload: val,
        key,
        isOptional: !!stg.modifier,
        len: stg.type.tag === "plain" ? 0 : stg.type.value.hashers.length,
      }
    }

    for (const callName of getEnumEntry(pallet.calls)) {
      if (!inputPallet.extrinsics[callName]) continue

      result.tx[callName] = {
        checksum: checksumBuilder.buildCall(pallet.name, callName)!,
        payload: staticBuilder.buildCall(pallet.name, callName),
      }
    }

    for (const errName of getEnumEntry(pallet.errors)) {
      if (!inputPallet.errors[errName]) continue

      result.errors[errName] = {
        checksum: checksumBuilder.buildError(pallet.name, errName)!,
        payload: staticBuilder.buildError(pallet.name, errName),
      }
    }

    for (const evName of getEnumEntry(pallet.events)) {
      if (!inputPallet.events[evName]) continue

      result.events[evName] = {
        checksum: checksumBuilder.buildEvent(pallet.name, evName)!,
        payload: staticBuilder.buildEvent(pallet.name, evName),
      }
    }

    for (const { name: constName } of pallet.constants) {
      if (!inputPallet.constants[constName]) continue

      result.constants[constName] = {
        checksum: checksumBuilder.buildConstant(pallet.name, constName)!,
        payload: staticBuilder.buildConstant(pallet.name, constName),
      }
    }
  }

  return { descriptorsData, declarations }
}
