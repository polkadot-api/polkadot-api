import { Tuple, uint } from "solidity-codecs"
import { solidityError } from "./error"

describe("solidityError", () => {
  it("correctly encodes the signature", () => {
    const customError = solidityError("InsufficientBalance", {
      available: uint,
      required: uint,
    })

    expect(customError.signature).toBe("0xcf479181")
  })

  it("correctly decodes its arguments", () => {
    const available = 1500n
    const required = 1000n
    const test = Tuple(uint, uint).enc([available, required])

    const customError = solidityError("InsufficientBalance", {
      available: uint,
      required: uint,
    })

    const decoded = customError.decodeArgs(test)

    expect(decoded).toEqual({ available, required })
  })
})
