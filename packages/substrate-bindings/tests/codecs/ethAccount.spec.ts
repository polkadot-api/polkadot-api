import { ethAccount } from "@/codecs"
import { toHex } from "@polkadot-api/utils"
import { expect, test } from "vitest"

test("it correctly encodes a valid address", () => {
  const validAddress = "0x24D18dbFBcEd732EAdF98EE520853e13909fE258"
  expect(toHex(ethAccount.enc(validAddress))).toEqual(
    validAddress.toLowerCase(),
  )
})

test("it throws on invalid addresses", () => {
  const invalidAddress = "0x24d18dbFBcEd732EAdF98EE520853e13909fE258"
  expect(() => ethAccount.enc(invalidAddress)).toThrow(/Invalid checksum/)
})
