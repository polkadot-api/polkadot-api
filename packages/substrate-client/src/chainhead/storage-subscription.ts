import { noop } from "@polkadot-api/utils"
import {
  ClientInnerRequest,
  FollowResponse,
  OperationError,
  OperationInaccessibleError,
  OperationLimitError,
} from ".."
import {
  CommonOperationEventsRpc,
  LimitReachedRpc,
  OperationStorageDoneRpc,
  OperationStorageItemsRpc,
  OperationWaitingForContinueRpc,
  OperationStorageStartedRpc,
} from "./json-rpc-types"

export const createStorageCb =
  (
    request: ClientInnerRequest<
      OperationStorageStartedRpc | LimitReachedRpc,
      | CommonOperationEventsRpc
      | OperationStorageItemsRpc
      | OperationStorageDoneRpc
      | OperationWaitingForContinueRpc
    >,
  ): FollowResponse["storageSubscription"] =>
  (hash, inputs, childTrie, onItems, onError, onDone, onDiscardedItems) => {
    if (inputs.length === 0) {
      onDone()
      return noop
    }

    let cancel = request(
      "chainHead_unstable_storage",
      [hash, inputs, childTrie],
      {
        onSuccess: (response, followSubscription) => {
          if (
            response.result === "limitReached" ||
            response.discardedItems === inputs.length
          )
            return onError(new OperationLimitError())

          const doneListening = followSubscription(response.operationId, {
            next: (event) => {
              switch (event.event) {
                case "operationStorageItems": {
                  onItems(event.items)
                  break
                }
                case "operationStorageDone": {
                  _onDone()
                  break
                }
                case "operationError": {
                  _onError(new OperationError(event.error))
                  break
                }
                case "operationInaccessible": {
                  _onError(new OperationInaccessibleError())
                  break
                }
                default:
                  request("chainHead_unstable_continue", [])
              }
            },
            error: onError,
          })

          cancel = () => {
            doneListening()
            request("chainHead_unstable_stopOperation", [response.operationId])
          }

          const _onError = (e: Error) => {
            cancel = noop
            doneListening()
            onError(e)
          }

          const _onDone = () => {
            cancel = noop
            doneListening()
            onDone()
          }

          onDiscardedItems(response.discardedItems)
        },
        onError,
      },
    )

    return () => {
      cancel()
    }
  }
