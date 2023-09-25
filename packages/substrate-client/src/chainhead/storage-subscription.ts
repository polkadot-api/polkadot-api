import { noop } from "@polkadot-api/utils"
import {
  ClientRequest,
  OperationError,
  OperationInaccessibleError,
  OperationLimitError,
} from ".."
import {
  CommonOperationEvents,
  LimitReached,
  OperationStorageDone,
  OperationStorageItems,
  OperationWaitingForContinue,
  StorageItemInput,
  StorageItemResponse,
  StorageOperationStarted,
} from "./internal-types"

export const createStorageCb =
  (
    request: ClientRequest<
      StorageOperationStarted | LimitReached,
      | CommonOperationEvents
      | OperationStorageItems
      | OperationStorageDone
      | OperationWaitingForContinue
    >,
  ) =>
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
              switch (event.type) {
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

          onDiscartedItems(response.discardedItems)
        },
        onError,
      },
    )

    return () => {
      cancel()
    }
  }
