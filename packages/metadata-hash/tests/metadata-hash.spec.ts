import { buildMetadataHash } from "@/metadata-hash"
import { getKsmMetadata } from "@polkadot-api/metadata-fixtures"
import { metadata } from "@polkadot-api/substrate-bindings"
import { beforeAll, describe, expect, it } from "vitest"

let ksmMetadata: Awaited<Uint8Array>
beforeAll(async () => {
  ksmMetadata = metadata.enc({
    magicNumber: 0x6174656d,
    metadata: {
      tag: "v15",
      value: await getKsmMetadata(),
    },
  })
})

describe("getChecksumBuilder snapshots", () => {
  it("generates metadata hash", () => {
    const result = buildMetadataHash(ksmMetadata, {
      decimals: 1,
      specName: "nice",
      base58Prefix: 1,
      specVersion: 1,
      tokenSymbol: "lol",
    })
    expect(result).toMatchSnapshot()
  })
})
