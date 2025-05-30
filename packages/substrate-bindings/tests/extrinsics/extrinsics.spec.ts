import { describe, expect, it } from "vitest"

import { extrinsicFormat } from "@/."

describe("extrinsic format", () => {
  const unsigned = 0b0000_0000
  const signed = 0b1000_0000
  const general = 0b0100_0000
  it("encodes and decodes v4", () => {
    expect(
      extrinsicFormat.enc({
        type: "bare",
        version: 4,
      }),
    ).toEqual(new Uint8Array([unsigned + 4]))
    expect(
      extrinsicFormat.enc({
        type: "signed",
        version: 4,
      }),
    ).toEqual(new Uint8Array([signed + 4]))
    expect(extrinsicFormat.dec(new Uint8Array([unsigned + 4]))).toEqual({
      type: "bare",
      version: 4,
    })
    expect(extrinsicFormat.dec(new Uint8Array([signed + 4]))).toEqual({
      type: "signed",
      version: 4,
    })
    // general does not work in v4
    expect(() => {
      extrinsicFormat.dec(new Uint8Array([general + 4]))
    }).toThrow()
  })
  it("encodes and decodes v5", () => {
    expect(
      extrinsicFormat.enc({
        type: "bare",
        version: 5,
      }),
    ).toEqual(new Uint8Array([unsigned + 5]))
    expect(
      extrinsicFormat.enc({
        type: "general",
        version: 5,
      }),
    ).toEqual(new Uint8Array([general + 5]))
    expect(extrinsicFormat.dec(new Uint8Array([unsigned + 5]))).toEqual({
      type: "bare",
      version: 5,
    })
    expect(extrinsicFormat.dec(new Uint8Array([general + 5]))).toEqual({
      type: "general",
      version: 5,
    })
    // signed does not work in v5
    expect(() => {
      extrinsicFormat.dec(new Uint8Array([signed + 5]))
    }).toThrow()
  })
})
