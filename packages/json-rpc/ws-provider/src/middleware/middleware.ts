import { getLegacy } from "./legacy"
import { methodsRouter } from "./methods-router"
import { modern } from "./modern"
import { withNumericIds } from "./numeric-ids"
import { apply } from "./utils"

const modernGroups = ["chainHead", "transaction", "chainSpec", "archive"].map(
  (name) => `${name}_v1`,
)
const isModern = (methods: string[]): boolean =>
  modernGroups.every((group) => methods.some((m) => m.startsWith(group)))

export const middleware = apply(
  withNumericIds,
  methodsRouter((methods) => (isModern(methods) ? modern : getLegacy)),
)
