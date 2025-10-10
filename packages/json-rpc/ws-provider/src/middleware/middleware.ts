import { methods } from "./methods"
import { withNumericIds } from "./numeric-ids"
import { Middleware } from "./types"

const layers = [withNumericIds, methods]

export const middleware: Middleware = (base) =>
  layers.reduce((a, b) => b(a), base)
