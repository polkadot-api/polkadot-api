import { abortablePromiseFn } from "@/internal-utils"
import { type ClientRequest } from "../client"

const identity =
  <T, Args extends Array<any> = []>() =>
  (x: T, ...args: Args): T =>
    args ? x : x

export class InvalidBlockHashError extends Error {
  constructor(hash: string) {
    super(`Invalid BlockHash: ${hash}`)
    this.name = "InvalidBlockHashError"
  }
}
const withInvalidBlockHash =
  <T>(
    fn: (x: T | null, hash: string) => T | null,
  ): ((x: T | null, hash: string) => T) =>
  (x, hash) => {
    const result = fn(x, hash)
    if (result === null) throw new InvalidBlockHashError(hash)
    return result
  }

export const getRequestCreator =
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

export const getArchive = (request: ClientRequest<string, any>) => {
  const creator = getRequestCreator(request)

  const body = creator<[hash: string]>("archive_v1_body")(
    withInvalidBlockHash(identity<string | null>()),
  )
  const finalizedHeight = creator<[]>("archive_v1_finalizedHeight")(
    identity<number>(),
  )
  const hashByHeight = creator<[height: number]>("archive_v1_hashByHeight")(
    identity<string[]>(),
  )
  const header = creator<[hash: string]>("archive_v1_header")(
    withInvalidBlockHash(identity<string | null>()),
  )

  const call = creator<
    [hash: string, function: string, callParameters: string]
  >("archive_v1_call")((
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

  return { body, finalizedHeight, hashByHeight, header, call }
}
