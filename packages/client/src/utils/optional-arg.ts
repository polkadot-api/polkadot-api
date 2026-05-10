export const isOptionalArg = (lastArg: unknown) => {
  if (typeof lastArg !== "object" || lastArg === null) return false
  // Reject anything that isn't a plain object (`{...}` literal). The original
  // check was `Object.entries(lastArg).every(...)`, which is vacuously `true`
  // for any object with zero own-enumerable properties — including empty
  // `Uint8Array`/`Buffer`/typed arrays. Those then get destructured with
  // `{ at }`, walking up the prototype chain to bind `at` to e.g.
  // `Uint8Array.prototype.at` (a function), which downstream code passes as
  // a block hash and ultimately produces a confusing `BlockNotPinnedError`
  // or wire-level `Invalid params` error.
  if (Object.getPrototypeOf(lastArg) !== Object.prototype) return false
  return Object.entries(lastArg).every(
    ([k, v]) =>
      (k === "at" && (v === undefined || typeof v === "string")) ||
      (k === "signal" && (v === undefined || v instanceof AbortSignal)),
  )
}
