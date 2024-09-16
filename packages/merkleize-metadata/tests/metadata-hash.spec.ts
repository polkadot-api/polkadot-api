import { merkleizeMetadata } from "@/."
import { beforeAll, describe, expect, it } from "vitest"
import { readFile } from "fs/promises"

let ksmMetadata: Awaited<Uint8Array>
let merkleizedMetadata: Awaited<ReturnType<typeof merkleizeMetadata>>
const ksmExtraInfo = { decimals: 12, tokenSymbol: "KSM" }
beforeAll(async () => {
  ksmMetadata = new Uint8Array(await readFile("./tests/ksm.bin"))
  merkleizedMetadata = merkleizeMetadata(ksmMetadata, ksmExtraInfo)
})

describe("merkleizeMetadata snapshots", () => {
  it("digests", () => {
    expect(merkleizedMetadata.digest()).toMatchSnapshot()
  })

  it("generates proofs for extrinsics", () => {
    expect(
      merkleizedMetadata.getProofForExtrinsic(
        "c10184008eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a4801127d333c8f60c0d81dd0a6e2e20ea477a06f96aaca1811872c54c244f0935c60b1f8a38aabef3d3a4ef4050d8d078e35b57b3cf4f9545f8145ce98afb8755384550000000000001448656c6c6f", // Hex for the transaction bytes
        "386d0f001a000000143c3561eefac7bc66facd4f0a7ec31d33b64f1827932fb3fda0ce361def535f143c3561eefac7bc66facd4f0a7ec31d33b64f1827932fb3fda0ce361def535f00",
      ),
    ).toMatchSnapshot()
  })

  it("generates proofs for extrinsics parts", () => {
    expect(
      merkleizedMetadata.getProofForExtrinsicParts(
        "0x040300648ad065ea416ca1725c29979cd41e288180f3e8aefde705cd3e0bab6cd212010bcb04fb711f01", // Call data
        "0x2503000000",
        "0x164a0f001a000000b0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe878a023bcb37967b6ba0685d002bb74e6cf3b4fc4ae37eb85f756bd9b026bede00",
      ),
    ).toMatchSnapshot()
  })

  it("generates proofs for extrinsic payload", () => {
    expect(
      merkleizedMetadata.getProofForExtrinsicPayload(
        "0x040300648ad065ea416ca1725c29979cd41e288180f3e8aefde705cd3e0bab6cd212010bcb04fb711f012503000000164a0f001a000000b0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe878a023bcb37967b6ba0685d002bb74e6cf3b4fc4ae37eb85f756bd9b026bede00",
      ),
    ).toMatchSnapshot()
  })

  it("fails to create with wrong extra info", () => {
    expect(() =>
      // ksm base58prefix is 2
      merkleizeMetadata(ksmMetadata, { ...ksmExtraInfo, base58Prefix: 1 }),
    ).toThrowError("SS58")
  })
})
