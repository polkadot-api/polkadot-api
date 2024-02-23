import {
  getChecksumBuilder,
  getLookupFn,
  getStaticBuilder,
} from "@polkadot-api/metadata-builders"
import type { V15 } from "@polkadot-api/substrate-bindings"
import { ApiData, PalletData } from "./types"

export const getCodegenInfo = (
  metadata: V15,
  keyName: string,
  selectOnly?: Array<string>,
) => {
  const descriptorsData: {
    pallets: Record<string, PalletData>
    apis: Record<string, ApiData>
  } = {
    pallets: {},
    apis: {},
  }

  const getLookup = getLookupFn(metadata.lookup)

  const getEnumEntry = (
    id: number | undefined | void,
  ): Array<{ name: string; docs: string[] }> => {
    if (!id) return []
    const lookup = getLookup(id)
    if (lookup.type !== "enum") return []
    return Object.keys(lookup.value).map((name) => ({
      name,
      docs: lookup.innerDocs[name] ?? [],
    }))
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
    descriptorsData.pallets[pallet.name] = result

    for (const stg of pallet.storage?.items ?? []) {
      if (whiteList && !whiteList.has(`${pallet.name}.query.${stg.name}`))
        continue

      const { key, val } = staticBuilder.buildStorage(pallet.name, stg.name)
      result.storage[stg.name] = {
        checksum: checksumBuilder.buildStorage(pallet.name, stg.name)!,
        payload: addExportedType(pallet.name, "Storage", stg.name, val),
        key: addExportedType(pallet.name, "Storage", stg.name + "_Args", key),
        isOptional: !stg.modifier,
        docs: stg.docs,
      }
    }

    for (const call of getEnumEntry(pallet.calls)) {
      if (whiteList && !whiteList.has(`${pallet.name}.call.${call.name}`))
        continue

      const payload = staticBuilder.buildCall(pallet.name, call.name)
      result.tx[call.name] = {
        checksum: checksumBuilder.buildCall(pallet.name, call.name)!,
        payload: addExportedType(pallet.name, "Tx", call.name, payload),
        docs: call.docs,
      }
    }

    for (const err of getEnumEntry(pallet.errors)) {
      if (whiteList && !whiteList.has(`${pallet.name}.error.${err.name}`))
        continue

      const payload = staticBuilder.buildError(pallet.name, err.name)
      result.errors[err.name] = {
        checksum: checksumBuilder.buildError(pallet.name, err.name)!,
        payload: addExportedType(pallet.name, "Error", err.name, payload),
        docs: err.docs,
      }
    }

    for (const ev of getEnumEntry(pallet.events)) {
      if (whiteList && !whiteList.has(`${pallet.name}.event.${ev.name}`))
        continue

      const payload = staticBuilder.buildEvent(pallet.name, ev.name)
      result.events[ev.name] = {
        checksum: checksumBuilder.buildEvent(pallet.name, ev.name)!,
        payload: addExportedType(pallet.name, "Event", ev.name, payload),
        docs: ev.docs,
      }
    }

    for (const { name: constName, docs } of pallet.constants) {
      if (whiteList && !whiteList.has(`${pallet.name}.const.${constName}`))
        continue

      const payload = staticBuilder.buildConstant(pallet.name, constName)
      result.constants[constName] = {
        checksum: checksumBuilder.buildConstant(pallet.name, constName)!,
        payload: addExportedType(pallet.name, "Constant", constName, payload),
        docs,
      }
    }
  }

  for (const api of metadata.apis) {
    const result: ApiData = {
      methods: {},
      docs: api.docs,
    }
    descriptorsData.apis[api.name] = result

    for (const method of api.methods) {
      if (whiteList && !whiteList.has(`api.${api.name}.${method.name}`))
        continue
      const st = staticBuilder.buildRuntimeCall(api.name, method.name)

      result.methods[method.name] = {
        checksum: checksumBuilder.buildRuntimeCall(api.name, method.name),
        args: addExportedType(api.name, "APIArgs", method.name, st.args),
        payload: addExportedType(api.name, "APIValue", method.name, st.value),
        docs: method.docs,
      }
    }
  }

  const assetPayment = metadata.extrinsic.signedExtensions.find(
    (x) => x.identifier === "ChargeAssetTxPayment",
  )
  let _assetId: null | number = null
  if (assetPayment) {
    const assetTxPayment = getLookup(assetPayment.type)
    if (assetTxPayment.type === "struct") {
      const optionalAssetId = assetTxPayment.value.asset_id
      if (optionalAssetId.type === "option") _assetId = optionalAssetId.value.id
    }
  }

  const assetId =
    _assetId === null
      ? null
      : {
          checksum: checksumBuilder.buildDefinition(_assetId)!,
          type: staticBuilder.getTypeFromVarName(
            staticBuilder.buildDefinition(_assetId),
          ),
        }

  const code = staticBuilder.getCode() + "\n\n" + exportedTypes.join("\n")
  const enums = staticBuilder.getEnums()

  return { descriptorsData, code, enums, assetId }
}
