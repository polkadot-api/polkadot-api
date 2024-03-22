export type PlainDescriptor<T> = number & { _type?: T }
export type AssetDescriptor<T> = string & { _type?: T }
export type StorageDescriptor<
  Args extends Array<any>,
  T,
  Optional extends true | false,
> = number & { _type: T; _args: Args; _optional: Optional }

export type TxDescriptor<Args extends {} | undefined> = number & {
  ___: Args
}

export type RuntimeDescriptor<Args extends Array<any>, T> = number & {
  __: [Args, T]
}

export type Descriptors = {
  pallets: Record<
    string,
    [
      Record<string, StorageDescriptor<any, any, any>>,
      Record<string, TxDescriptor<any>>,
      Record<string, PlainDescriptor<any>>,
      Record<string, PlainDescriptor<any>>,
      Record<string, PlainDescriptor<any>>,
    ]
  >
  apis: Record<string, Record<string, RuntimeDescriptor<any, any>>>
  asset: AssetDescriptor<any>
  checksums: string[]
}

type PickDescriptors<
  Idx extends 0 | 1 | 2 | 3 | 4,
  T extends Descriptors["pallets"],
> = {
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
          KeyArgs: Key
          Value: Value
          IsOptional: Optional
        }
      : unknown
  }
}

type ExtractTx<T extends Record<string, Record<string, TxDescriptor<any>>>> = {
  [K in keyof T]: {
    [KK in keyof T[K]]: T[K][KK] extends TxDescriptor<infer Args>
      ? Args
      : unknown
  }
}

type ExtractPlain<
  T extends Record<string, Record<string, PlainDescriptor<any>>>,
> = {
  [K in keyof T]: {
    [KK in keyof T[K]]: T[K][KK] extends PlainDescriptor<infer Value>
      ? Value
      : unknown
  }
}

export type QueryFromDescriptors<T extends Descriptors> = ExtractStorage<
  PickDescriptors<0, T["pallets"]>
>

export type TxFromDescriptors<T extends Descriptors> = ExtractTx<
  PickDescriptors<1, T["pallets"]>
>

export type EventsFromDescriptors<T extends Descriptors> = ExtractPlain<
  PickDescriptors<2, T["pallets"]>
>

export type ErrorsFromDescriptors<T extends Descriptors> = ExtractPlain<
  PickDescriptors<3, T["pallets"]>
>

export type ConstFromDescriptors<T extends Descriptors> = ExtractPlain<
  PickDescriptors<4, T["pallets"]>
>
