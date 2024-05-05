import { abortablePromiseFn, noop } from "@/internal-utils"
import {
  CommonOperationEventsRpc,
  OperationResponseRpc,
} from "./json-rpc-types"
import {
  OperationError,
  OperationInaccessibleError,
  OperationLimitError,
} from "./errors"
import { ClientInnerRequest } from "./public-types"
import { chainHead } from "@/methods"

export const createOperationPromise =
  <I extends { operationId: string; event: string }, O, A extends Array<any>>(
    operationName: string,
    factory: (
      ...args: A
    ) => [
      Array<any>,
      (e: I, res: (x: O) => void, rej: (e: Error) => void) => void,
    ],
  ) =>
  (
    request: ClientInnerRequest<
      OperationResponseRpc,
      I | CommonOperationEventsRpc
    >,
  ) =>
    abortablePromiseFn<O, A>((res, rej, ...args) => {
      let isRunning = true
      let cancel = () => {
        isRunning = false
      }

      const [requestArgs, logicCb] = factory(...args)
      request(operationName, requestArgs, {
        onSuccess: (response, followSubscription) => {
          if (response.result === "limitReached")
            return rej(new OperationLimitError())

          const { operationId } = response
          const stopOperation = () => {
            request(chainHead.stopOperation, [operationId])
          }

          if (!isRunning) return stopOperation()

          let done = noop
          const _res = (x: O) => {
            isRunning = false
            done()
            res(x)
          }
          const _rej = (x: Error) => {
            isRunning = false
            done()
            rej(x)
          }

          done = followSubscription(operationId, {
            next: (e) => {
              const _e = e as CommonOperationEventsRpc
              if (_e.event === "operationError")
                rej(new OperationError(_e.error))
              else if (_e.event === "operationInaccessible")
                rej(new OperationInaccessibleError())
              else logicCb(e as I, _res, _rej)
            },
            error: _rej,
          })

          cancel = () => {
            if (isRunning) {
              done()
              stopOperation()
            }
          }
        },
        onError: rej,
      })

      return () => {
        cancel()
      }
    })
