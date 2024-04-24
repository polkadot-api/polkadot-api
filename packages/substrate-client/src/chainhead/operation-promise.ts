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
    operationName: () => string,
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
      const [requestArgs, logicCb] = factory(...args)
      let cancel = request(operationName(), requestArgs, {
        onSuccess: (response, followSubscription) => {
          if (response.result === "limitReached") {
            cancel = noop
            return rej(new OperationLimitError())
          }

          let isOperationGoing = true
          let done = noop
          const _res = (x: O) => {
            isOperationGoing = false
            done()
            res(x)
          }
          const _rej = (x: Error) => {
            isOperationGoing = false
            done()
            rej(x)
          }

          done = followSubscription(response.operationId, {
            next: (e) => {
              const _e = e as CommonOperationEventsRpc
              if (_e.event === "operationError") {
                rej(new OperationError(_e.error))
              } else if (_e.event === "operationInaccessible") {
                rej(new OperationInaccessibleError())
              } else {
                logicCb(e as I, _res, _rej)
              }
            },
            error: _rej,
          })

          cancel = () => {
            if (!isOperationGoing) return
            done()
            request(chainHead.stopOperation, [response.operationId])
          }
        },
        onError: rej,
      })

      return () => {
        cancel()
      }
    })
