import ksm from "./ksm.json"
import { expect, describe, it } from "vitest"
import { getDynamicBuilder } from "@/."

describe("getDynamicBuilder", () => {
  const builder = getDynamicBuilder(ksm as any)
  it("batched call", () => {
    const result = builder
      .buildCall("Utility", "batch")
      .codec.dec(
        "0x08040700dc97b0271418c41f80d049826cfb1d6bd2e44e11ea39759addf6b01632ca973d0b00409452a30306050400dc97b0271418c41f80d049826cfb1d6bd2e44e11ea39759addf6b01632ca973d",
      )

    expect(result).toMatchSnapshot()
  })

  it("felloship referenda submit", () => {
    const result = builder
      .buildCall("FellowshipReferenda", "submit")
      .codec.dec(
        "0x2b0f01590100004901415050524f56455f52464328303030352c39636261626661383035393864323933353833306330396331386530613065346564383232376238633866373434663166346134316438353937626236643434290101000000",
      )
    expect(result).toMatchSnapshot()
  })
})
