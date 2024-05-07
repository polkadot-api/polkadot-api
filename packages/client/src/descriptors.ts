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

export type PalletsDef = Record<
  string,
  [
    Record<string, StorageDescriptor<any, any, any>>,
    Record<string, TxDescriptor<any>>,
    Record<string, PlainDescriptor<any>>,
    Record<string, PlainDescriptor<any>>,
    Record<string, PlainDescriptor<any>>,
  ]
>
export type ChainDefinition = {
  descriptors: {
    pallets: PalletsDef
    apis: Record<string, Record<string, RuntimeDescriptor<any, any>>>
  }
  asset: AssetDescriptor<any>
  checksums: Promise<string[]>
}

type PickDescriptors<Idx extends 0 | 1 | 2 | 3 | 4, T extends PalletsDef> = {
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

export type QueryFromPalletsDef<T extends PalletsDef> = ExtractStorage<
  PickDescriptors<0, T>
>

export type TxFromPalletsDef<T extends PalletsDef> = ExtractTx<
  PickDescriptors<1, T>
>

export type EventsFromPalletsDef<T extends PalletsDef> = ExtractPlain<
  PickDescriptors<2, T>
>

export type ErrorsFromPalletsDef<T extends PalletsDef> = ExtractPlain<
  PickDescriptors<3, T>
>

export type ConstFromPalletsDef<T extends PalletsDef> = ExtractPlain<
  PickDescriptors<4, T>
>
