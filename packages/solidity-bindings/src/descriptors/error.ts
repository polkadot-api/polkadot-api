import { fromHex, toHex } from "@unstoppablejs/utils"
import { Codec, keccak, StringRecord, Struct } from "solidity-codecs"

export type ErrorArg<T extends StringRecord<Codec<any>>> = {
  [K in keyof T]: T[K] extends Codec<infer V> ? V : unknown
}

export type UnionErrors<E, R = never> = E extends [infer V, ...infer Rest]
  ? UnionErrors<
      Rest,
      | R
      | (V extends SolidityError<infer C, infer N>
          ? {
              name: N
              data: ErrorArg<C>
            }
          : never)
    >
  : R

export type ErrorResult<
  E extends Array<SolidityError<any, any>>,
  T,
> = [] extends E
  ? T
  :
      | {
          ok: true
          result: T
        }
      | {
          ok: false
          error: UnionErrors<E>
        }

export interface SolidityError<
  F extends StringRecord<Codec<any>>,
  N extends string,
> {
  decodeArgs: (input: string | Uint8Array | ArrayBuffer) => ErrorArg<F>
  name: N
  signature: string
}

export type ErrorReader = (data: string) => { name: string; data: any } | null

export const solidityError = <
  F extends StringRecord<Codec<any>>,
  N extends string,
>(
  name: N,
  args: F,
): SolidityError<F, N> => {
  const { s, dec } = Struct(args)
  return {
    name,
    signature: toHex(keccak(name + s).slice(0, 4)),
    decodeArgs: dec,
  }
}

export const findErrorHex = (e: any) => {
  let ee = e
  const visited = new Set<any>([ee])
  while (ee.data && !visited.has(ee.data)) {
    ee = ee.data
    visited.add(ee)
  }
  if (typeof ee !== "string") return null
  return ee
}

export const createErrorReader = (errors: Array<SolidityError<any, any>>) => {
  const errorsMap = new Map<string, SolidityError<any, any>>(
    errors.map((e) => [e.signature, e]),
  )

  return (data: string) => {
    try {
      const key = data.slice(0, 10)
      const err = errorsMap.get(key)

      return !err
        ? null
        : {
            name: err.name,
            data: err.decodeArgs(fromHex(data).slice(4)),
          }
    } catch (_) {
      return null
    }
  }
}

export const errorsEnhancer = (
  errors: Array<SolidityError<any, any>>,
  unhandledErrorReader: ErrorReader,
) => {
  const readError = createErrorReader(errors)

  return async <T>(p: Promise<T>) => {
    if (errors.length === 0) return p

    try {
      const result = await p
      return {
        ok: true,
        result,
      }
    } catch (e: any) {
      const errorHex = findErrorHex(e)
      if (!errorHex) throw e

      let error = readError(errorHex)

      if (error)
        return {
          ok: false,
          error,
        }
      error = unhandledErrorReader(errorHex)
      throw error ? error : e
    }
  }
}
