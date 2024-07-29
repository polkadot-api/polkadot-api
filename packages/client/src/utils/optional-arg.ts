export const isOptionalArg = (lastArg: unknown) =>
  typeof lastArg === "object" &&
  lastArg !== null &&
  Object.entries(lastArg).every(
    ([k, v]) =>
      (k === "at" && (v === undefined || typeof v === "string")) ||
      (k === "signal" && (v === undefined || v instanceof AbortSignal)),
  )
