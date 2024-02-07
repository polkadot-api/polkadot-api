import type { Anonymize } from "./codecs"

export type PlainDescriptor<T> = string & { _type?: T }
export type StorageDescriptor<
  Args extends Array<any>,
  T,
  Optional extends true | false,
> = string & { _type: T; _args: Args; _optional: Optional }

export type TxDescriptor<Args extends Array<any>> = string & {
  _args: Args
}

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
          IsOptional: Optional
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
