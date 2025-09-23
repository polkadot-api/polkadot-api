import {
  getChecksumBuilder,
  MetadataLookup,
} from "@polkadot-api/metadata-builders"
import { getTypesBuilder } from "./types-builder"
import { anonymizeType } from "./anonymize"

export function generateChainTypes(
  lookupFn: MetadataLookup,
  typesBuilder: ReturnType<typeof getTypesBuilder>,
  checksumBuilder: ReturnType<typeof getChecksumBuilder>,
  key: string,
) {
  const palletTypedefImport = `import("../../../typedef")`
  const palletFiles = lookupFn.metadata.pallets.map((pallet) => {
    const fileName = `chains/${key}/pallets/${pallet.name}.ts`

    const storageEntries =
      pallet.storage?.items.map(({ name, modifier, type, docs }) => {
        const { key, val, opaque } = typesBuilder.buildStorage(
          pallet.name,
          name,
        )

        const descriptorType = `StorageDescriptor<${key}, ${val === "undefined" ? "null" : val}, ${!modifier}, ${opaque}>`

        const keyImport =
          type.tag === "plain"
            ? null
            : `v${checksumBuilder.buildDefinition(type.value.key)}`
        const valueImport = `v${checksumBuilder.buildDefinition(type.tag === "plain" ? type.value : type.value.value)}`

        return `
        /**
         ${docs.map((doc: string) => ` * ${doc.trim()}`).join("\n")}
         */
        export const ${pallet.name}${name}: ${descriptorType} = {
          async key() {
            ${keyImport ? `const { ${keyImport} } = await ${palletTypedefImport}; return ${keyImport}();` : ""}
          },
          async value() {
            const { ${valueImport} } = await ${palletTypedefImport}; return ${valueImport}();
          }
        } as any;`
      }) ?? []

    const file = `
      // @ts-nocheck
      import type { StorageDescriptor, FixedSizeBinary, Binary, Enum, FixedSizeArray } from 'polkadot-api'
      import type { ${typesBuilder.getTypeFileImports().join(", ")} } from '../../../types'

      ${anonymizeType}

      ${storageEntries.join("\n")}
    `
    return [fileName, file]
  })

  return Object.fromEntries(palletFiles) as Record<string, string>
}
