import { NOTIN } from "../../lib"

export const withDefault: <T>(value: T | NOTIN, fallback: T) => T = (
  value,
  fallback,
) => (value === NOTIN ? fallback : value)
