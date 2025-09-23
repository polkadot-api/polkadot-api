import fs from "fs/promises"
import { beforeAll, describe, expect, it } from "vitest"

import { knownTypes } from "@/known-types"
import { getDocsTypesBuilder } from "@/types-builder"
import {
  getChecksumBuilder,
  getLookupFn,
  MetadataLookup,
} from "@polkadot-api/metadata-builders"
import {
  metadata as metadataCodec,
  unifyMetadata,
} from "@polkadot-api/substrate-bindings"

let lookup: MetadataLookup
let checksumBuilder: ReturnType<typeof getChecksumBuilder>

beforeAll(async () => {
  const metadataRaw = await fs.readFile("./tests/ksm.bin")
  lookup = getLookupFn(unifyMetadata(metadataCodec.dec(metadataRaw)))
  checksumBuilder = getChecksumBuilder(lookup)
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
          value: "ResultPayload<FixedSizeBinary<32>, MmrPrimitivesError>",
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
