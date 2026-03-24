import { hybridMiddleware } from "./hybrid"
import { methodsRouter } from "./methods-router"
import { withNumericIds } from "./numeric-ids"
import { apply } from "./utils"

export const middleware = apply(withNumericIds, methodsRouter(hybridMiddleware))
