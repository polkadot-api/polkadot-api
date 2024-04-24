import { chainHead } from "@/methods"
import type { OperationBodyDoneRpc } from "./json-rpc-types"
import { createOperationPromise } from "./operation-promise"

export const createBodyFn = createOperationPromise(
  () => chainHead.body,
  (hash: string) => [
    [hash],
    (e: OperationBodyDoneRpc, res: (x: Array<string>) => void) => {
      res(e.value)
    },
  ],
)
