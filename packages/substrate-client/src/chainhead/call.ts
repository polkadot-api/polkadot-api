import { chainHead } from "@/methods"
import type { OperationCallDoneRpc } from "./json-rpc-types"
import { createOperationPromise } from "./operation-promise"

export const createCallFn = createOperationPromise(
  () => chainHead.call,
  (hash: string, fnName: string, callParameters: string) => [
    [hash, fnName, callParameters],
    (e: OperationCallDoneRpc, res: (output: string) => void) => {
      res(e.output)
    },
  ],
)
