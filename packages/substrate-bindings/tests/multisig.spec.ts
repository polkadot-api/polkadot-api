import { getMultisigAccountId, getSs58AddressInfo } from "@/utils"
import { describe, expect, it } from "vitest"

describe("getMultisigAccountId", () => {
  it("gives the correct Id regardless of order input", () => {
    const signatories = [
      "1HPKZzzd9nyr2DdvtPxytNMZm3Ld5nh3BBY4Ecgg9JxgL7G",
      "1yCg8NSCgjS4K5KDK5DZGhxUCxmgVyhyG6vBPn5wqUmLuYo",
      "12WQMLv8itdKJ83R4y3qNGYCRrsU6bFjyd4ZvcE4tmJoSiPv",
      "11F8h8qmSUctFVMayEjw4aDuZbVKUGc4SmSN2mPBcdKDBMG",
      "1ZSPR3zNg5Po3obkhXTPR95DepNBzBZ3CyomHXGHK9Uvx6w",
      "1ZebzHrCP2rqScFEL2T1pczs7SGL49wbzyJ9c5Em7Xmsj9L",
      "15fTH34bbKGMUjF1bLmTqxPYgpg481imThwhWcQfCyktyBzL",
    ]
    const expected = fromSs58(
      "16LCaN2Qw8dCauR2mcrGmf3yj6Q8L8KBz4a5xmCDDPpsXpTr",
    )
    expect(
      getMultisigAccountId({
        threshold: 4,
        signatories: signatories.map(fromSs58),
      }),
    ).toEqual(expected)

    signatories.sort((a, b) => a.localeCompare(b))
    expect(
      getMultisigAccountId({
        threshold: 4,
        signatories: signatories.map(fromSs58),
      }),
    ).toEqual(expected)
  })
})

const fromSs58 = (value: string) => {
  const info = getSs58AddressInfo(value)
  if (!info.isValid) throw new Error("not a valid ss58 address")
  return info.publicKey
}
