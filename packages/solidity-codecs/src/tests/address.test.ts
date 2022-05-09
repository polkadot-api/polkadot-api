import { address } from "../"
import { testCodec } from "./test-utils"

const tester = testCodec(address)

describe("address", () => {
  it("works", () => {
    tester(
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      "0x00000000000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c8",
    )
  })
})
