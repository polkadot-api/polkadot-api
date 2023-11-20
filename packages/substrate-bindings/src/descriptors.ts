// @ts-ignore
export interface PlainDescriptor<T> {
  checksum: string
}

export interface StorageDescriptor<
  Args extends Array<any>,
  // @ts-ignore
  T,
  Optional extends 0 | 1,
> {
  checksum: string
  len: Args["length"]
  optional: Optional
}

// @ts-ignore
export interface TxDescriptor<Args extends Array<any>> {
  checksum: string
}

export const getPlainDescriptor = <T>(
  checksum: string,
): PlainDescriptor<T> => ({
  checksum,
})

export const getStorageDescriptor = <
  Args extends Array<any>,
  T,
  Optional extends 0 | 1,
>(
  checksum: string,
  len: Args["length"],
  optional: Optional,
): StorageDescriptor<Args, T, Optional> => ({
  checksum,
  len,
  optional,
})

export const getTxDescriptor = <Args extends Array<any>>(
  checksum: string,
): TxDescriptor<Args> => ({
  checksum,
})

export type Descriptors = Record<
  string,
  [
    Record<string, StorageDescriptor<any, any, any>>,
    Record<string, TxDescriptor<any>>,
    Record<string, PlainDescriptor<any>>,
    Record<string, PlainDescriptor<any>>,
    Record<string, PlainDescriptor<any>>,
  ]
>

type PickDescriptors<Idx extends 0 | 1 | 2 | 3 | 4, T extends Descriptors> = {
  [K in keyof T]: T[K][Idx]
}

type Anonymize<T> = T extends
  | string
  | number
  | bigint
  | boolean
  | void
  | undefined
  | null
  | symbol
  ? T
  : T extends (...args: infer Args) => infer R
  ? (...args: Anonymize<Args>) => Anonymize<R>
  : {
      [K in keyof T]: Anonymize<T[K]>
    }

type ExtractStorage<
  T extends Record<string, Record<string, StorageDescriptor<any, any, any>>>,
> = {
  [K in keyof T]: {
    [KK in keyof T[K]]: T[K][KK] extends StorageDescriptor<
      infer Key,
      infer Value,
      infer Optional
    >
      ? {
          KeyArgs: Anonymize<Key>
          Value: Anonymize<Value>
          IsOptional: Optional extends 1 ? false : true
        }
      : unknown
  }
}

type ExtractTx<T extends Record<string, Record<string, TxDescriptor<any>>>> = {
  [K in keyof T]: {
    [KK in keyof T[K]]: T[K][KK] extends TxDescriptor<infer Args>
      ? Anonymize<Args>
      : unknown
  }
}

type ExtractPlain<
  T extends Record<string, Record<string, PlainDescriptor<any>>>,
> = {
  [K in keyof T]: {
    [KK in keyof T[K]]: T[K][KK] extends PlainDescriptor<infer Value>
      ? Anonymize<Value>
      : unknown
  }
}

export type QueryFromDescriptors<T extends Descriptors> = ExtractStorage<
  PickDescriptors<0, T>
>

export type TxFromDescriptors<T extends Descriptors> = ExtractTx<
  PickDescriptors<1, T>
>

export type EventsFromDescriptors<T extends Descriptors> = ExtractPlain<
  PickDescriptors<2, T>
>

export type ErrorsFromDescriptors<T extends Descriptors> = ExtractPlain<
  PickDescriptors<3, T>
>

export type ConstFromDescriptors<T extends Descriptors> = ExtractPlain<
  PickDescriptors<4, T>
>
