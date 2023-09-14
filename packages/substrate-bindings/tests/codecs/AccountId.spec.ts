import { expect, test } from "vitest"
import { bytesToHex } from "@noble/hashes/utils"

import { AccountId, SS58String } from "@/."

test.each([
  [
    0,
    "Polkadot",
    "15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5" as SS58String,
    "d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d",
  ],
  [
    42,
    "Substrate",
    "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY" as SS58String,
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

test("AccountId should decode/encode 33 byte payload", () => {
  const codec = AccountId(42, 33)
  const ss58Address =
    "KVqMLDzVyHChtJ8imRTkP22Tuz8Yd7X9MABUhz1rHNpHny12V" as SS58String
  const publicKey = codec.enc(ss58Address)
  expect(publicKey).toHaveLength(33)
  expect(publicKey).toEqual(new Uint8Array(33))
  expect(codec.dec(new Uint8Array(33))).toBe(ss58Address)
})

test("AccountId encode should throw with an invalid payload length", () => {
  const codec = AccountId(42)
  const ss58Address =
    "KVqMLDzVyHChtJ8imRTkP22Tuz8Yd7X9MABUhz1rHNpHny12V" as SS58String
  expect(() => codec.enc(ss58Address)).toThrowError()
})

test("AccountId encode should throw with an invalid checksum", () => {
  const codec = AccountId(42, 33)
  // ss58 with invalid checksum
  const ss58Address =
    "KVqMLDzVyHChtJ8imRTkP22Tuz8Yd7X9MABUhz1rHNpHnxw8j" as SS58String
  expect(() => codec.enc(ss58Address)).toThrowError("Invalid checksum")
})

test("AccountId encode should throw with an invalid ss58 prefix", () => {
  const codec = AccountId(1)
  // ss58 with invalid ss58 prefix
  const ss58Address =
    "5HTFSjkXgjYXHL4zHqfRA4HH8LbserTLRWfcm3xe43ksQDe4" as SS58String
  expect(() => codec.enc(ss58Address)).toThrowError("Invalid SS58 prefix")
})
