import { getKsmMetadata } from "@polkadot-api/metadata-fixtures"
import { expect, describe, it, beforeAll } from "vitest"
import { getViewBuilder } from "@/."

describe("getViewBuilder", () => {
  let builder: ReturnType<typeof getViewBuilder>
  beforeAll(async () => {
    builder = getViewBuilder(await getKsmMetadata())
  })

  it("batched call", () => {
    const result = builder.callDecoder(
      "0x180008040700dc97b0271418c41f80d049826cfb1d6bd2e44e11ea39759addf6b01632ca973d0b00409452a30306050400dc97b0271418c41f80d049826cfb1d6bd2e44e11ea39759addf6b01632ca973d",
    )

    // it has circular references, so we have to remove it
    // otherwise vitest blows up
    delete (result.args as any).shape

    expect(result).toMatchSnapshot()
  })

  it("felloship referenda submit", () => {
    const result = builder.callDecoder(
      "0x17002b0f01590100004901415050524f56455f52464328303030352c39636261626661383035393864323933353833306330396331386530613065346564383232376238633866373434663166346134316438353937626236643434290101000000",
    )
    // it has circular references, so we have to remove it
    // otherwise vitest blows up
    delete (result.args as any).shape
    expect(result).toMatchSnapshot()
  })
})
