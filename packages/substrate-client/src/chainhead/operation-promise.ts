import { ClientRequest } from "@/client"
import { CommonOperationEvents, OperationResponse } from "./types"
import { abortablePromiseFn } from "@/utils/abortablePromiseFn"

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
  (request: ClientRequest<OperationResponse, I | CommonOperationEvents>) =>
    abortablePromiseFn<O, A>((res, rej, ...args) => {
      const [requestArgs, logicCb] = factory(...args)
      let cancel = request(
        operationName,
        requestArgs,
        (response, followSubscription) => {
          if (response.result === "limitReached") {
            cancel = () => {}
            return rej(new Error("Operations limit reached"))
          }

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

          const done = followSubscription(response.operationId, {
            next: (e) => {
              const _e = e as CommonOperationEvents
              if (
                _e.event === "operationError" ||
                _e.event === "operationInaccessible"
              ) {
                rej(new Error(_e.event))
              } else {
                logicCb(e as I, _res, _rej)
              }
            },
            error: _rej,
          })

          let isOperationGoing = true
          cancel = () => {
            if (!isOperationGoing) return
            done()
            request("chainHead_unstable_stopOperation", [followSubscription])
          }
        },
      )

      return () => {
        cancel()
      }
    })
