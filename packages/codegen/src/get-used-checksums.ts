import { getChecksumBuilder } from "@polkadot-api/metadata-builders"
import { V14, V15 } from "@polkadot-api/substrate-bindings"

export const getUsedChecksums = (
  metadata: V14 | V15,
  builder = getChecksumBuilder(metadata),
) => {
  const buildEnum = (val: number | undefined, cb: (name: string) => void) => {
    if (val === undefined) return

    const lookup = metadata.lookup[val]
    if (lookup.def.tag !== "variant") throw null
    lookup.def.value.forEach((x) => cb(x.name))
  }

  const checksums = new Set<string>()

  metadata.pallets.forEach((pallet) => {
    pallet.storage?.items.forEach(({ name }) =>
      checksums.add(builder.buildStorage(pallet.name, name)!),
    ) ?? []
    pallet.constants.forEach(({ name }) =>
      checksums.add(builder.buildConstant(pallet.name, name)!),
    )
    buildEnum(pallet.calls, (name) =>
      checksums.add(builder.buildCall(pallet.name, name)!),
    )
    buildEnum(pallet.events, (name) =>
      checksums.add(builder.buildEvent(pallet.name, name)!),
    )
    buildEnum(pallet.errors, (name) =>
      checksums.add(builder.buildError(pallet.name, name)!),
    )
  })

  metadata.apis.forEach((api) =>
    api.methods.forEach((method) =>
      checksums.add(builder.buildRuntimeCall(api.name, method.name)!),
    ),
  )

  return checksums
}
