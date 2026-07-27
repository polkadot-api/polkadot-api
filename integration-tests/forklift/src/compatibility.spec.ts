import { dotAh, MultiAddress } from "@polkadot-api/descriptors"
import {
  CompatibilityLevel,
  createClient,
  InvalidArgsError,
} from "polkadot-api"
import { describe, expect, it } from "vitest"
import { getForkliftProvider } from "./lib/forklift"
import { getDevSigner } from "./lib/signer"

describe("compatibility API", () => {
  it("allows checking for non-existing entries", async () => {
    const client = createClient(getForkliftProvider("compatibility_api")[0])
    const api = await client.getTypedApi(dotAh).getStaticApis()

    // Use case is when you have a union of different `typedApi`, you might want to check which one is compatible with a specific case
    const entry = (api.compat.query.Balances as any).NonExistingThing
    expect(await entry.isCompatible()).toBe(false)
    expect(await entry.isCompatible(CompatibilityLevel.Partial)).toBe(false)

    client.destroy()
  })

  it("throws an InvalidArguments error if one of the arguments doesn't match the expected type", async () => {
    const client = createClient(getForkliftProvider("compatibility_api")[0])
    const api = client.getUnsafeApi()
    const signer = getDevSigner()

    const promise = api.tx.Balances.transfer_keep_alive({
      // @ts-expect-error
      dest: MultiAddress.Id(3),
      value: 123n,
    }).sign(signer)

    await expect(promise).rejects.toThrow()
    const matchedError: InvalidArgsError = await promise.catch((ex) => ex)

    expect(matchedError).toBeInstanceOf(InvalidArgsError)
    expect(matchedError.callType).toBe("Transaction")
    expect(matchedError.callEntry).toBe("Balances.transfer_keep_alive")
    expect(matchedError.incompatibleResult).toEqual({
      compatible: false,
      path: "dest.value",
      reason: {
        type: "UnmatchedType",
        value: {
          actualType: "number",
          expectedType: "string",
        },
      },
    })

    client.destroy()
  })
})
