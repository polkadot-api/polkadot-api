import ksm from "./ksm.json"
import { expect, describe, it } from "vitest"
import { getChecksumBuilder } from "@/."

describe("getChecksumBuilder", () => {
  const builder = getChecksumBuilder(ksm as any)
  it("batched call", () => {
    const result = builder.buildCall("Utility", "batch")
    expect(result).toMatchSnapshot()
  })

  it("felloship referenda submit", () => {
    const result = builder.buildCall("FellowshipReferenda", "submit")
    expect(result).toMatchSnapshot()
  })
})
