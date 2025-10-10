import { getLegacy } from "./legacy"
import { methodsRouter } from "./methods"
import { modern } from "./modern"
import { withNumericIds } from "./numeric-ids"
import { Middleware } from "./types"

const isModern = (methods: string[]): boolean =>
  methods.some((x) => x.startsWith("chainHead_v1")) &&
  methods.some((x) => x.startsWith("transaction_v1")) &&
  methods.some((x) => x.startsWith("archive_v1"))

const layers: Array<Middleware> = [
  withNumericIds,
  methodsRouter((methods) => (isModern(methods) ? modern : getLegacy)),
]

export const middleware: Middleware = (base) =>
  layers.reduce((a, b) => b(a), base)
