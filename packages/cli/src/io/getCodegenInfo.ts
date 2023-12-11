import { V14 } from "@polkadot-api/substrate-bindings"
import {
  getChecksumBuilder,
  getLookupFn,
  getStaticBuilder,
} from "@polkadot-api/substrate-codegen"
import { PalletData } from "./types"

export const getCodegenInfo = (
  metadata: V14,
  keyName: string,
  selectOnly?: Array<string>,
) => {
  const descriptorsData: Record<string, PalletData> = {}
  const getLookup = getLookupFn(metadata.lookup)

  const getEnumEntry = (id: number | undefined | void): Array<string> => {
    if (!id) return []
    const lookup = getLookup(id)
    if (lookup.type !== "enum") return []
    return Object.keys(lookup.value)
  }

  const staticBuilder = getStaticBuilder(metadata)
  const checksumBuilder = getChecksumBuilder(metadata)
  const exportedTypes: Array<string> = []
  const addExportedType = (
    pallet: string,
    entryType: string,
    entryName: string,
    varName: string,
  ) => {
    const typeName = [keyName, entryType, pallet, entryName].join("_")
    exportedTypes.push(
      `export type ${typeName} = ${staticBuilder.getTypeFromVarName(varName)};`,
    )
    return typeName
  }

  const whiteList = selectOnly && new Set(selectOnly)

  for (const pallet of metadata.pallets) {
    const result: PalletData = {
      constants: {},
      errors: {},
      events: {},
      storage: {},
      tx: {},
    }
    descriptorsData[pallet.name] = result

    for (const stg of pallet.storage?.items ?? []) {
      if (whiteList && !whiteList.has(`${pallet.name}.query.${stg.name}`))
        continue

      const { key, val } = staticBuilder.buildStorage(pallet.name, stg.name)
      result.storage[stg.name] = {
        checksum: checksumBuilder.buildStorage(pallet.name, stg.name)!,
        payload: addExportedType(pallet.name, "Storage", stg.name, val),
        key: addExportedType(pallet.name, "Storage", stg.name + "_Args", key),
        isOptional: !stg.modifier,
      }
    }

    for (const callName of getEnumEntry(pallet.calls)) {
      if (whiteList && !whiteList.has(`${pallet.name}.call.${callName}`))
        continue

      const payload = staticBuilder.buildCall(pallet.name, callName)
      result.tx[callName] = {
        checksum: checksumBuilder.buildCall(pallet.name, callName)!,
        payload: addExportedType(pallet.name, "Tx", callName, payload),
      }
    }

    for (const errName of getEnumEntry(pallet.errors)) {
      if (whiteList && !whiteList.has(`${pallet.name}.error.${errName}`))
        continue

      const payload = staticBuilder.buildError(pallet.name, errName)
      result.errors[errName] = {
        checksum: checksumBuilder.buildError(pallet.name, errName)!,
        payload: addExportedType(pallet.name, "Error", errName, payload),
      }
    }

    for (const evName of getEnumEntry(pallet.events)) {
      if (whiteList && !whiteList.has(`${pallet.name}.event.${evName}`))
        continue

      const payload = staticBuilder.buildEvent(pallet.name, evName)
      result.events[evName] = {
        checksum: checksumBuilder.buildEvent(pallet.name, evName)!,
        payload: addExportedType(pallet.name, "Event", evName, payload),
      }
    }

    for (const { name: constName } of pallet.constants) {
      if (whiteList && !whiteList.has(`${pallet.name}.const.${constName}`))
        continue

      const payload = staticBuilder.buildConstant(pallet.name, constName)
      result.constants[constName] = {
        checksum: checksumBuilder.buildConstant(pallet.name, constName)!,
        payload: addExportedType(pallet.name, "Constant", constName, payload),
      }
    }
  }

  const code = staticBuilder.getCode() + "\n\n" + exportedTypes.join("\n")

  return { descriptorsData, code }
}
