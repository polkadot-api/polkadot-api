import type { OperationBodyDone } from "./types"
import { createOperationPromise } from "./operation-promise"

export const createBodyFn = createOperationPromise(
  "chainHead_unstable_body",
  (hash: string) => [
    [hash],
    (e: OperationBodyDone, res: (x: Array<string>) => void) => {
      res(e.value)
    },
  ],
)
