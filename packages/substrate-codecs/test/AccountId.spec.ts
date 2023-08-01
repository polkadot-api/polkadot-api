import { expect, test } from "vitest"
import { bytesToHex } from "@noble/hashes/utils"

import { AccountId } from "../src/AccountId"

test.each([
  [
    0,
    "Polkadot",
    "15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5",
    "d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d",
  ],
  [
    42,
    "Substrate",
    "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
    "d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d",
  ],
])(
  "AccounId(%i) should decode/encode Alice ss58 %s address",
  (prefix, _chain, ss58Address, hexPublicKey) => {
    const codec = AccountId(prefix)
    const publicKey = codec.enc(ss58Address)
    expect(bytesToHex(publicKey)).toBe(hexPublicKey)
    expect(codec.dec(publicKey)).toBe(ss58Address)
  },
)
