import { abortablePromiseFn } from "@/internal-utils"
import { type ClientRequest } from "../client"
import { createStorageCb } from "./storage-subscription"
import { createStorageFn } from "./storage"
import { Archive } from "./public-types"
import { InvalidBlockHashError } from "./errors"

const identity =
  <T, Args extends Array<any> = []>() =>
  (x: T, ...args: Args): T =>
    args ? x : x

const withInvalidBlockHash =
  <T>(
    fn: (x: T | null, hash: string) => T | null,
  ): ((x: T | null, hash: string) => T) =>
  (x, hash) => {
    const result = fn(x, hash)
    if (result === null) throw new InvalidBlockHashError(hash)
    return result
  }

const getRequestCreator =
  (request: ClientRequest<any, any>) =>
  <A extends Array<any>>(method: string) =>
  <I, O>(mapper: (input: I, ...args: A) => O) =>
    abortablePromiseFn<O, A>((res, rej, ...args) =>
      request(method, args, {
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

export const getArchive = (request: ClientRequest<string, any>): Archive => {
  const archiveRequest: ClientRequest<string, any> = (
    method: string,
    ...rest
  ) => request(`archive_v1_${method}`, ...rest)
  const creator = getRequestCreator(archiveRequest)

  const call = creator<
    [hash: string, function: string, callParameters: string]
  >("call")((
    x:
      | { success: true; value: string }
      | { success: false; error: string }
      | null,
    hash,
  ) => {
    if (!x) throw new InvalidBlockHashError(hash)
    if (!x.success) throw new Error(x.error)
    return x.value
  })

  const storageSubscription = createStorageCb(archiveRequest)

  return {
    call,
    body: creator<[hash: string]>("body")(
      withInvalidBlockHash(identity<string[] | null>()),
    ),
    finalizedHeight: creator<[]>("finalizedHeight")(identity<number>()),
    hashByHeight:
      creator<[height: number]>("hashByHeight")(identity<string[]>()),
    header: creator<[hash: string]>("header")(
      withInvalidBlockHash(identity<string | null>()),
    ),
    storageSubscription,
    storage: createStorageFn(storageSubscription),
  }
}
