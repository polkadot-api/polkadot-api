import { expect, describe, it, beforeAll } from "vitest"
import fs from "fs/promises"
import assert from "assert"

import {
  defaultDeclarations,
  getDocsTypesBuilder,
  getTypesBuilder,
} from "@/types-builder"
import { MetadataLookup } from "@polkadot-api/metadata-builders"
import {
  metadata as metadataCodec,
  unifyMetadata,
} from "@polkadot-api/substrate-bindings"
import { getLookupFn } from "@polkadot-api/metadata-builders"
import { knownTypes } from "@/known-types"
import { getChecksumBuilder } from "@polkadot-api/metadata-builders"
import { getDispatchErrorId } from "@/generate-descriptors"
import { generateMultipleDescriptors } from "@/generate-multiple-descriptors"

let lookup: MetadataLookup
let checksumBuilder: ReturnType<typeof getChecksumBuilder>

beforeAll(async () => {
  const metadataRaw = await fs.readFile("./tests/ksm.bin")
  lookup = getLookupFn(unifyMetadata(metadataCodec.dec(metadataRaw)))
  checksumBuilder = getChecksumBuilder(lookup)
})

describe("types-builder", () => {
  const getBuilder = () =>
    getTypesBuilder(defaultDeclarations(), lookup, knownTypes, checksumBuilder)

  describe("buildTypeDefinition", () => {
    it("should generate correct dispatchErrorType", () => {
      const typesBuilder = getBuilder()

      const dispatchErrorId = getDispatchErrorId(lookup)!
      expect(typesBuilder.buildTypeDefinition(dispatchErrorId)).toEqual(
        "Anonymize<I69ftqh8hqffme>",
      )
    })
  })

  describe("buildStorage", () => {
    for (const [pallet, entry, expectedKey, expectedVal] of [
      ["System", "Account", "[Key: SS58String]", "Anonymize<I5sesotjlssv2d>"],
      ["System", "Events", "[]", "Anonymize<Ia5dve0uamet4h>"],
      ["XcmPallet", "VersionNotifiers", "Anonymize<Ic4qvh5df9s5gp>", "bigint"],
      ["XcmPallet", "VersionDiscoveryQueue", "[]", "Anonymize<I50sjs3s5lud21>"],
    ]) {
      it(`generates ${expectedKey}: ${expectedVal} for ${pallet}::${entry}`, () => {
        const typesBuilder = getBuilder()

        const result = typesBuilder.buildStorage(pallet, entry)
        expect(result.key).toEqual(expectedKey)
        expect(result.val).toEqual(expectedVal)
      })
    }
  })

  describe("buildEvent", () => {
    for (const [pallet, entry, expected] of [
      ["System", "ExtrinsicFailed", "Anonymize<Iau4actk6tfs21>"],
      ["ConvictionVoting", "Undelegated", "SS58String"],
    ]) {
      it(`generates ${expected} for ${pallet}::${entry}`, () => {
        const typesBuilder = getBuilder()

        const result = typesBuilder.buildEvent(pallet, entry)
        expect(result).toEqual(expected)
      })
    }
  })

  describe("buildError", () => {
    for (const [pallet, entry, expected] of [
      ["XcmPallet", "InvalidAssetNotConcrete", "undefined"],
    ]) {
      it(`generates ${expected} for ${pallet}::${entry}`, () => {
        const typesBuilder = getBuilder()

        const result = typesBuilder.buildError(pallet, entry)
        expect(result).toEqual(expected)
      })
    }
  })

  describe("buildCall", () => {
    for (const [pallet, entry, expected] of [
      ["System", "authorize_upgrade", "Anonymize<Ib51vk42m1po4n>"],
      ["Society", "resign_candidacy", "undefined"],
    ]) {
      it(`generates ${expected} for ${pallet}::${entry}`, () => {
        const typesBuilder = getBuilder()

        const result = typesBuilder.buildCall(pallet, entry)
        expect(result).toEqual(expected)
      })
    }
  })

  describe("buildRuntimeCall", () => {
    for (const [pallet, entry, expectedArgs, expectedValue] of [
      ["Core", "version", "[]", "Anonymize<Ic6nglu2db2c36>"],
      [
        "Core",
        "execute_block",
        "[block: Anonymize<Iaqet9jc3ihboe>]",
        "undefined",
      ],
    ]) {
      it(`generates ${expectedArgs} -> ${expectedValue} for ${pallet}::${entry}`, () => {
        const typesBuilder = getBuilder()

        const result = typesBuilder.buildRuntimeCall(pallet, entry)
        expect(result.args).toEqual(expectedArgs)
        expect(result.value).toEqual(expectedValue)
      })
    }
  })

  describe("buildConstant", () => {
    for (const [pallet, entry, expected] of [
      ["System", "BlockHashCount", "number"],
      ["System", "Version", "Anonymize<Ic6nglu2db2c36>"],
    ]) {
      it(`generates ${expected} for ${pallet}::${entry}`, () => {
        const typesBuilder = getBuilder()

        const result = typesBuilder.buildConstant(pallet, entry)
        expect(result).toEqual(expected)
      })
    }
  })

  describe("imports", () => {
    it("collects imports from both common types and papi itself", () => {
      const typesBuilder = getBuilder()

      lookup.metadata.pallets.forEach((pallet) => {
        pallet.storage?.items.forEach(({ name }) =>
          typesBuilder.buildStorage(pallet.name, name),
        )
        pallet.constants.forEach(({ name }) =>
          typesBuilder.buildConstant(pallet.name, name),
        )

        const forEachVariant = (
          type: "calls" | "errors" | "events",
          cb: (name: string) => void,
        ) => {
          if (!pallet[type]) return
          const entry = lookup.metadata.lookup[pallet[type].type]
          assert(entry.def.tag === "variant")
          entry.def.value.forEach(({ name }) => {
            cb(name)
          })
        }
        forEachVariant("calls", (name) =>
          typesBuilder.buildCall(pallet.name, name),
        )
        forEachVariant("errors", (name) =>
          typesBuilder.buildError(pallet.name, name),
        )
        forEachVariant("events", (name) =>
          typesBuilder.buildEvent(pallet.name, name),
        )
      })

      expect(typesBuilder.getTypeFileImports()).toMatchSnapshot()
      expect(typesBuilder.getClientFileImports()).toMatchSnapshot()
    })
  })
})

describe("generateDescriptors", () => {
  const generateKusamaDescriptorContent = (
    metadata = lookup.metadata,
  ): string => {
    const [kusamaDescriptors] = generateMultipleDescriptors(
      [
        {
          key: "kusama",
          metadata,
          knownTypes,
        },
      ],
      {
        client: "@polkadot-api/descriptors/client",
        metadataTypes: "./metadata-types",
        types: "./types",
        descriptorValues: "./descriptor-values",
        common: "./common",
      },
    ).descriptorTypesFiles

    return kusamaDescriptors.content
  }
  const getRequiredExtensionsDefinition = (content: string) => {
    const match = content.match(
      /type IRequiredExtensions = PlainDescriptor<([\s\S]*?)>\nconst requiredExtensions/,
    )

    if (!match) throw new Error("IRequiredExtensions definition not found")
    return match[1]
  }

  it("adds required extensions to Kusama chain definition", () => {
    const content = generateKusamaDescriptorContent()
    const requiredExtensions = getRequiredExtensionsDefinition(content)

    expect(content).toContain("type IRequiredExtensions = PlainDescriptor<")
    expect(content).toContain(
      "const requiredExtensions: IRequiredExtensions = {} as IRequiredExtensions",
    )
    expect(content).toContain("requiredExtensions: IRequiredExtensions")
    expect(content).not.toContain("export type KusamaRequiredSignedExtensions")
    expect(content).not.toContain("const requiredExtensions = [")

    for (const extension of [
      "CheckSpecVersion",
      "CheckTxVersion",
      "CheckGenesis",
      "CheckMortality",
      "CheckNonce",
      "ChargeTransactionPayment",
      "CheckMetadataHash",
    ]) {
      expect(requiredExtensions).toContain(`"${extension}"`)
    }

    for (const extension of ["CheckNonZeroSender", "CheckWeight"]) {
      expect(requiredExtensions).not.toContain(`"${extension}"`)
    }
  }, 10_000)

  it("excludes required extensions missing from any tx extension version", () => {
    const [baseExtensions] = Object.values(
      lookup.metadata.extrinsic.extensionsByVersion,
    )
    const content = generateKusamaDescriptorContent({
      ...lookup.metadata,
      extrinsic: {
        ...lookup.metadata.extrinsic,
        extensionsByVersion: {
          ...lookup.metadata.extrinsic.extensionsByVersion,
          1: baseExtensions.filter((ext) => ext.identifier !== "CheckNonce"),
        },
      },
    })
    const requiredExtensions = getRequiredExtensionsDefinition(content)

    expect(requiredExtensions).toContain(`"CheckSpecVersion"`)
    expect(requiredExtensions).not.toContain(`"CheckNonce"`)
  }, 10_000)
})

describe("docs-types-builder", () => {
  const getBuilder = () =>
    getDocsTypesBuilder(lookup, knownTypes, checksumBuilder)

  describe("buildStorage", () => {
    for (const [pallet, entry, expectedArgs, expectedPayload] of [
      [
        "System",
        "Account",
        "[Key: SS58String]",
        "{" +
          '"nonce": number, ' +
          '"consumers": number, ' +
          '"providers": number, ' +
          '"sufficients": number, ' +
          '"data": {"free": bigint, "reserved": bigint, "frozen": bigint, "flags": bigint}' +
          "}",
      ],
      [
        "XcmPallet",
        "VersionNotifiers",
        "[number, XcmVersionedLocation]",
        "bigint",
      ],
      [
        "XcmPallet",
        "VersionDiscoveryQueue",
        "[]",
        "Array<[XcmVersionedLocation, number]>",
      ],
    ]) {
      it(`generates ${expectedArgs}: ${expectedPayload} for ${pallet}::${entry}`, () => {
        const docsTypesBuilder = getBuilder()

        const result = docsTypesBuilder.buildStorage(pallet, entry)
        expect(result.args).toEqual(expectedArgs)
        expect(result.payload).toEqual(expectedPayload)
      })
    }
  })

  describe("buildCall", () => {
    for (const [pallet, entry, expectedPayload] of [
      [
        "XcmPallet",
        "send",
        '{"dest": XcmVersionedLocation, "message": XcmVersionedXcm}',
      ],
      [
        "Multisig",
        "as_multi_threshold_1",
        '{"other_signatories": Array<SS58String>, "call": TxCallData}',
      ],
    ]) {
      it(`generates expected payload for ${pallet}::${entry}`, () => {
        const docsTypesBuilder = getBuilder()

        const result = docsTypesBuilder.buildCall(pallet, entry)
        expect(result).toEqual(expectedPayload)
      })
    }
  })

  describe("buildRuntimeCall", () => {
    for (const [api, method, expectedPayload] of [
      [
        "MmrApi",
        "mmr_root",
        {
          args: "[]",
          value: "ResultPayload<SizedHex<32>, MmrPrimitivesError>",
        },
      ] as const,
    ]) {
      it(`generates expected payload for ${api}::${method}`, () => {
        const docsTypesBuilder = getBuilder()

        const result = docsTypesBuilder.buildRuntimeCall(api, method)
        expect(result).toEqual(expectedPayload)
      })
    }
  })

  describe("imports", () => {
    for (const [pallet, entry, expectedImport] of [
      ["XcmPallet", "VersionDiscoveryQueue", "XcmVersionedLocation"],
      ["System", "ExecutionPhase", "Phase"],
    ]) {
      it(`imports ${expectedImport} from descriptors types for storage entry ${pallet}::${entry}`, () => {
        const docsTypesBuilder = getBuilder()

        docsTypesBuilder.buildStorage(pallet, entry)

        expect(docsTypesBuilder.recordTypeFileImports()).toContain(
          expectedImport,
        )
      })
    }

    for (const [pallet, entry, expectedImport] of [
      ["XcmPallet", "send", "XcmVersionedLocation"],
      ["XcmPallet", "force_xcm_version", "XcmV3Junctions"],
    ]) {
      it(`imports ${expectedImport} from descriptors types for call ${pallet}::${entry}`, () => {
        const docsTypesBuilder = getBuilder()

        docsTypesBuilder.buildCall(pallet, entry)

        expect(docsTypesBuilder.recordTypeFileImports()).toContain(
          expectedImport,
        )
      })

      it(`imports ${expectedImport} from descriptors types for call ${pallet}::${entry}, cached version`, () => {
        const docsTypesBuilder = getBuilder()

        docsTypesBuilder.buildCall(pallet, entry)
        docsTypesBuilder.recordTypeFileImports()

        docsTypesBuilder.buildCall(pallet, entry)
        expect(docsTypesBuilder.recordTypeFileImports()).toContain(
          expectedImport,
        )
      })
    }
  })

  describe("circular types handling", () => {
    it("outputs __Circular only for self-referencing types", () => {
      const docsTypesBuilder = getBuilder()

      docsTypesBuilder.buildRuntimeCall(
        "TransactionPaymentCallApi",
        "query_call_fee_details",
      )
      const result = docsTypesBuilder.buildCall(
        "Multisig",
        "as_multi_threshold_1",
      )

      // failure would look like this:
      // `'{"other_signatories": SS58String, "call": __Circular...`
      expect(result).toEqual(
        '{"other_signatories": Array<SS58String>, "call": TxCallData}',
      )
    })
  })

  describe("descriptors-types", () => {
    it("records expanded typings for all known types", () => {
      const docsTypesBuilder = getBuilder()
      docsTypesBuilder.buildStorage("XcmPallet", "VersionDiscoveryQueue")

      const descriptorsTypes = docsTypesBuilder.getDescriptorsTypes()
      expect(descriptorsTypes).toContainEqual({
        checksum: "ap9sokavcmq5o",
        name: "XcmVersionedLocation",
        type:
          "Enum<{" +
          '"V2": {"parents": number, "interior": XcmV2MultilocationJunctions}, ' +
          '"V3": {"parents": number, "interior": XcmV3Junctions}, ' +
          '"V4": {"parents": number, "interior": XcmV3Junctions}' +
          "}>",
      })
    })
  })
})
