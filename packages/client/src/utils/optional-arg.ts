export const isOptionalArg = (lastArg: unknown) => {
  if (typeof lastArg !== "object" || lastArg === null) return false
  // Reject anything that isn't a plain object (`{...}` literal). Checking
  // only `typeof` isn't enough because it's problematic with parameters
  // like `Uint8Array`/`Buffer`/typed arrays.
  if (Object.getPrototypeOf(lastArg) !== Object.prototype) return false
  return Object.entries(lastArg).every(
    ([k, v]) =>
      (k === "at" && (v === undefined || typeof v === "string")) ||
      (k === "signal" && (v === undefined || v instanceof AbortSignal)),
  )
}
