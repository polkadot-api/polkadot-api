import { buildMetadataHash } from "@/metadata-hash"
import { getKsmMetadata } from "@polkadot-api/metadata-fixtures"
import { beforeAll, describe, expect, it } from "vitest"

let ksm: Awaited<ReturnType<typeof getKsmMetadata>>
beforeAll(async () => {
  ksm = await getKsmMetadata()
})

describe("getChecksumBuilder snapshots", () => {
  it("generates metadata hash", () => {
    const result = buildMetadataHash(ksm, {
      decimals: 1,
      specName: "nice",
      base58Prefix: 1,
      specVersion: 1,
      tokenSymbol: "lol",
    })
    expect(result).toMatchSnapshot()
  })
})
