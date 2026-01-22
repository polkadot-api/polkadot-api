import { Binary, Codec, ResultPayload } from "@polkadot-api/substrate-bindings"

type Tuple<T> = [T, ...T[]]
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never
type UndoEnum<T> = UnionToIntersection<
  T extends { type: string; value: unknown }
    ? {
        [K in T["type"]]: (T & { type: K })["value"]
      }
    : T
>

type _Inner<T> = T extends void
  ? {}
  : undefined extends T
    ? {
        inner: ShapedCodec<Exclude<T, undefined>>
      }
    : T extends
          | string
          | number
          | bigint
          | boolean
          | void
          | undefined
          | null
          | symbol
          | Uint8Array
          | Binary
      ? {}
      : T extends Tuple<any>
        ? {
            inner: {
              [K in keyof T]: ShapedCodec<T[K]>
            }
          }
        : T extends Array<infer R>
          ? {
              inner: ShapedCodec<R>
            }
          : T extends ResultPayload<infer OK, infer KO>
            ? {
                inner: {
                  ok: ShapedCodec<OK>
                  ko: ShapedCodec<KO>
                }
              }
            : {
                inner: {
                  [K in keyof T]: ShapedCodec<T[K]>
                }
              }
type Inner<T> = _Inner<UndoEnum<T>>

export type ShapedCodec<T> = Codec<T> & Inner<T>
