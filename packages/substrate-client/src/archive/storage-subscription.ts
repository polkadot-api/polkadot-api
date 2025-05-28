import type { ClientRequest } from "@/client"
import { noop } from "@polkadot-api/utils"
import { Archive } from "./public-types"
import { StorageItemResponse } from "@/chainhead"
import { StorageError } from "./errors"

type StorageEvent = {
  event: "storage"
} & StorageItemResponse

type StorageDone = {
  event: "storageDone"
}

type StorageErrorEvent = {
  event: "storageError"
  error: string
}

export const createStorageCb =
  (
    request: ClientRequest<
      string,
      StorageEvent | StorageDone | StorageErrorEvent
    >,
  ): Archive["storageSubscription"] =>
  (hash, inputs, childTrie, onItem, onError, onDone) => {
    if (inputs.length === 0) {
      onDone()
      return noop
    }

    let isRunning = true
    let cancel = () => {
      isRunning = false
    }

    request("archive_v1_storage", [hash, inputs, childTrie], {
      onSuccess: (operationId, followSubscription) => {
        const stopOperation = () => {
          request("archive_v1_stopStorage", [operationId])
        }

        if (!isRunning) return stopOperation()

        const doneListening = followSubscription(operationId, {
          next: (event) => {
            switch (event.event) {
              case "storage": {
                const { event: _, ...item } = event
                onItem(item)
                break
              }
              case "storageDone": {
                _onDone()
                break
              }
              default: {
                _onError(new StorageError(event.error))
                break
              }
            }
          },
          error: onError,
        })

        const tearDown = () => {
          cancel = noop
          doneListening()
        }

        cancel = () => {
          tearDown()
          stopOperation()
        }

        const _onError = (e: Error) => {
          tearDown()
          onError(e)
        }

        const _onDone = () => {
          tearDown()
          onDone()
        }
      },
      onError,
    })

    return () => {
      cancel()
    }
  }
