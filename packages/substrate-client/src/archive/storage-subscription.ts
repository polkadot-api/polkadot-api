import type { ClientRequest } from "@polkadot-api/raw-client"
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
    archiveRequest: ClientRequest<
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

    archiveRequest("storage", [hash, inputs, childTrie], {
      onSuccess: (operationId, followSubscription) => {
        const stopOperation = () => {
          archiveRequest("stopStorage", [operationId])
        }

        if (!isRunning) return stopOperation()

        const doneListening = followSubscription(operationId, {
          next: (event) => {
            const { event: type } = event
            if (type === "storage") {
              const { event: _, ...item } = event
              onItem(item)
            } else if (type === "storageDone") _onDone()
            else _onError(new StorageError(event.error))
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
