import { abortablePromiseFn } from "@/internal-utils"
import { type ClientRequest } from "../client"
import { createStorageCb } from "./storage-subscription"
import { createStorageFn } from "./storage"
import { Archive } from "./public-types"
import { CallError, BlockHashNotFoundError } from "./errors"

const identity =
  <T>() =>
  (x: T): T =>
    x

const handleInvalidBlockHash =
  <T>() =>
  (result: T | null, hash: string): T => {
    if (result === null) throw new BlockHashNotFoundError(hash)
    return result
  }

export const getArchive = (request: ClientRequest<any, any>): Archive => {
  const archiveRequest: ClientRequest<any, any> = (method: string, ...rest) =>
    request(`archive_v1_${method}`, ...rest)

  const fnCreator =
    <A extends Array<any>>(method: string) =>
    <I, O>(mapper: (input: I, ...args: A) => O) =>
      abortablePromiseFn<O, A>((res, rej, ...args) =>
        archiveRequest(method, args, {
          onSuccess: (x: I) => {
            try {
              res(mapper(x, ...args))
            } catch (e) {
              rej(e)
            }
          },
          onError: rej,
        }),
      )

  const header = fnCreator<[hash: string]>("header")(
    handleInvalidBlockHash<string>(),
  )

  const body = fnCreator<[hash: string]>("body")(
    handleInvalidBlockHash<string[]>(),
  )

  const storageSubscription = createStorageCb(archiveRequest)
  const storage = createStorageFn(storageSubscription)

  const call = fnCreator<
    [hash: string, function: string, callParameters: string]
  >("call")((
    x:
      | { success: true; value: string }
      | { success: false; error: string }
      | null,
    hash,
  ) => {
    if (!x) throw new BlockHashNotFoundError(hash)
    if (!x.success) throw new CallError(x.error)
    return x.value
  })

  const finalizedHeight = fnCreator<[]>("finalizedHeight")(identity<number>())
  const hashByHeight =
    fnCreator<[height: number]>("hashByHeight")(identity<string[]>())

  return {
    header,
    body,
    storageSubscription,
    storage,
    call,
    finalizedHeight,
    hashByHeight,
  }
}
