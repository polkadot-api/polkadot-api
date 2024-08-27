import { expect, describe, it, beforeAll } from "vitest"
import fs from "fs/promises"
import assert from "assert"

import { defaultDeclarations, getTypesBuilder } from "@/types-builder"
import { MetadataLookup } from "@polkadot-api/metadata-builders"
import { V14, V15, metadata } from "@polkadot-api/substrate-bindings"
import { getLookupFn } from "@polkadot-api/metadata-builders"
import knownTypes from "@/known-types"
import { getChecksumBuilder } from "@polkadot-api/metadata-builders"
import { getDispatchErrorId } from "@/generate-descriptors"

describe("types-builder", () => {
  let metadataLookup: MetadataLookup
  let metadataDecoded: V14 | V15
  let checksumBuilder: ReturnType<typeof getChecksumBuilder>

  const getBuilder = () =>
    getTypesBuilder(
      defaultDeclarations(),
      metadataLookup,
      knownTypes,
      checksumBuilder,
    )

  beforeAll(async () => {
    const metadataRaw = await fs.readFile("./tests/ksm.bin")
    metadataDecoded = metadata.dec(metadataRaw).metadata.value as V14 | V15
    metadataLookup = getLookupFn(metadataDecoded)
    checksumBuilder = getChecksumBuilder(metadataLookup)
  })

  describe("buildTypeDefinition", () => {
    it("should generate correct dispatchErrorType", () => {
      const typesBuilder = getBuilder()

      const dispatchErrorId = getDispatchErrorId(metadataLookup)!
      expect(typesBuilder.buildTypeDefinition(dispatchErrorId)).toEqual(
        "Anonymize<I69ftqh8hqffme>",
      )
    })
  })

  describe("buildStorage", () => {
    for (const [pallet, entry, expectedKey, expectedVal] of [
      ["System", "Account", "[Key: SS58String]", "Anonymize<I5sesotjlssv2d>"],
      ["System", "Events", "[]", "Anonymize<Iarv2l5iokakqs>"],
      ["XcmPallet", "VersionNotifiers", "Anonymize<I5dnj7v75alj6b>", "bigint"],
      ["XcmPallet", "VersionDiscoveryQueue", "[]", "Anonymize<I61487j17uoqo8>"],
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
      ["ConvictionVoting", "Undelegated", "Anonymize<SS58String>"],
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

      metadataDecoded.pallets.forEach((pallet) => {
        pallet.storage?.items.forEach(({ name }) =>
          typesBuilder.buildStorage(pallet.name, name),
        )
        pallet.constants?.forEach(({ name }) =>
          typesBuilder.buildConstant(pallet.name, name),
        )

        const forEachVariant = (
          type: "calls" | "errors" | "events",
          cb: (name: string) => void,
        ) => {
          if (!pallet[type]) return
          const lookup = metadataDecoded.lookup[pallet[type]!]
          assert(lookup.def.tag === "variant")
          lookup.def.value.forEach(({ name }) => {
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
