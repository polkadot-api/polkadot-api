import { getLegacy } from "./legacy"
import { methodsRouter } from "./methods"
import { modern } from "./modern"
import { withNumericIds } from "./numeric-ids"
import { Middleware } from "./types"

const modernGroups = ["chainHead", "transaction", "chainSpec", "archive"].map(
  (name) => `${name}_v1`,
)

const isModern = (methods: string[]): boolean =>
  modernGroups.every((group) => methods.some((m) => m.startsWith(group)))

const layers: Array<Middleware> = [
  withNumericIds,
  methodsRouter((methods) => (isModern(methods) ? modern : getLegacy)),
]

export const middleware: Middleware = (base) =>
  layers.reduce((a, b) => b(a), base)
