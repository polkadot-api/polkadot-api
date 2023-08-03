import { fc, test } from "@fast-check/vitest"
import { expect } from "vitest"
import { Identity } from "./identity"

test.prop([fc.uint8Array()])("identity", async (input) => {
  expect(Identity(input)).toStrictEqual(input)
})
