import { describe, expect, it } from "vitest"
import { isOptionalArg } from "@/utils/optional-arg"

describe("isOptionalArg", () => {
  describe("returns true for genuine options objects", () => {
    it("empty plain object", () => {
      expect(isOptionalArg({})).toBe(true)
    })

    it("{ at: '0x…' }", () => {
      expect(isOptionalArg({ at: "0x123" })).toBe(true)
    })

    it("{ at: undefined } (kept for compatibility with PR #600)", () => {
      expect(isOptionalArg({ at: undefined })).toBe(true)
    })

    it("{ signal: <AbortSignal> }", () => {
      const ctrl = new AbortController()
      expect(isOptionalArg({ signal: ctrl.signal })).toBe(true)
    })

    it("{ signal: undefined }", () => {
      expect(isOptionalArg({ signal: undefined })).toBe(true)
    })

    it("{ at: '0x…', signal: <AbortSignal> }", () => {
      const ctrl = new AbortController()
      expect(isOptionalArg({ at: "0xabc", signal: ctrl.signal })).toBe(true)
    })

    it("Object.create(null) (null-prototype literal-like)", () => {
      // Not strictly a {…} literal (prototype is null, not Object.prototype),
      // but historically accepted. Documented as rejected by this fix —
      // callers should pass a plain object literal.
      expect(isOptionalArg(Object.create(null))).toBe(false)
    })
  })

  describe("returns false for non-options values", () => {
    it("null", () => {
      expect(isOptionalArg(null)).toBe(false)
    })

    it("undefined", () => {
      expect(isOptionalArg(undefined)).toBe(false)
    })

    it("a number", () => {
      expect(isOptionalArg(42)).toBe(false)
    })

    it("a string", () => {
      expect(isOptionalArg("0x123")).toBe(false)
    })

    it("a bigint", () => {
      expect(isOptionalArg(0n)).toBe(false)
    })

    it("a function (e.g. callback mistakenly passed last)", () => {
      expect(isOptionalArg(() => {})).toBe(false)
    })
  })

  describe("returns false for typed arrays / binary buffers (regression cover)", () => {
    // Empty Uint8Array used to be misclassified as options because
    // `Object.entries(emptyUint8Array)` is `[]` and `[].every(…)` is
    // vacuously true. Destructuring `{ at }` then walked up the prototype
    // chain to `Uint8Array.prototype.at` (a function), which downstream
    // code threw into chainHead as a "block hash" and crashed the runtime
    // call. See: BlockNotPinnedError "Block function at() …".

    it("empty Uint8Array (Binary.fromHex('0x'))", () => {
      expect(isOptionalArg(new Uint8Array(0))).toBe(false)
    })

    it("non-empty Uint8Array", () => {
      expect(isOptionalArg(new Uint8Array([0xde, 0xad]))).toBe(false)
    })

    it("Uint8Array of all zeros", () => {
      expect(isOptionalArg(new Uint8Array(8))).toBe(false)
    })

    it("Uint16Array", () => {
      expect(isOptionalArg(new Uint16Array(0))).toBe(false)
    })

    it("Int32Array", () => {
      expect(isOptionalArg(new Int32Array([1, 2, 3]))).toBe(false)
    })

    it("ArrayBuffer", () => {
      expect(isOptionalArg(new ArrayBuffer(0))).toBe(false)
    })

    it("DataView", () => {
      expect(isOptionalArg(new DataView(new ArrayBuffer(8)))).toBe(false)
    })
  })

  describe("returns false for other built-ins that aren't plain objects", () => {
    it("array", () => {
      expect(isOptionalArg([])).toBe(false)
      expect(isOptionalArg([1, 2, 3])).toBe(false)
    })

    it("Map", () => {
      expect(isOptionalArg(new Map())).toBe(false)
    })

    it("Set", () => {
      expect(isOptionalArg(new Set())).toBe(false)
    })

    it("Date", () => {
      expect(isOptionalArg(new Date())).toBe(false)
    })

    it("RegExp", () => {
      expect(isOptionalArg(/abc/)).toBe(false)
    })

    it("Error instance", () => {
      expect(isOptionalArg(new Error("x"))).toBe(false)
    })

    it("class instance with no own properties", () => {
      class C {
        method() {
          return 1
        }
      }
      expect(isOptionalArg(new C())).toBe(false)
    })

    it("class instance with options-shaped own properties", () => {
      class C {
        at = "0xabc"
      }
      // The shape *looks* like options but it isn't a plain object —
      // we deliberately reject these. If a caller wants this to be
      // recognised, they should spread into a plain object first.
      expect(isOptionalArg(new C())).toBe(false)
    })
  })

  describe("returns false for plain objects with non-options keys", () => {
    it("extra unknown key", () => {
      expect(isOptionalArg({ at: "0x123", unknown: 1 })).toBe(false)
    })

    it("only an unknown key", () => {
      expect(isOptionalArg({ foo: "bar" })).toBe(false)
    })

    it("at with wrong type (number)", () => {
      expect(isOptionalArg({ at: 42 })).toBe(false)
    })

    it("at with wrong type (boolean)", () => {
      expect(isOptionalArg({ at: true })).toBe(false)
    })

    it("signal with wrong type (string)", () => {
      expect(isOptionalArg({ signal: "abort" })).toBe(false)
    })
  })
})
