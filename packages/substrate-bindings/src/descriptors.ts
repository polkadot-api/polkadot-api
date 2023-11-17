export interface DescriptorCommon<Pallet extends string, Name extends string> {
  checksum: string
  pallet: Pallet
  name: Name
}

// @ts-ignore
export interface ArgsWithPayloadCodec<Args extends Array<any>, O> {
  len: Args["length"]
}

export interface PlainDescriptor<
  Common extends DescriptorCommon<string, string>,
  Codecs,
> {
  props: Common
  codecs: Codecs
}

export interface StorageDescriptor<
  Common extends DescriptorCommon<string, string>,
  Codecs extends ArgsWithPayloadCodec<any, any>,
> {
  props: Common
  codecs: Codecs
  optional: 0 | 1
}

export interface TxDescriptor<
  Common extends DescriptorCommon<string, string>,
  Codecs extends Array<any>,
> {
  props: Common
  codecs: Codecs
}

export type Descriptor =
  | PlainDescriptor<any, any>
  | StorageDescriptor<any, any>
  | TxDescriptor<any, any>

export const getPalletCreator = <Pallet extends string>(pallet: Pallet) => {
  const getPayloadDescriptor = <Name extends string, Codecs>(
    checksum: string,
    name: Name,
    codecs: Codecs,
  ): PlainDescriptor<DescriptorCommon<Pallet, Name>, Codecs> =>
    ({
      props: { checksum, pallet, name },
      codecs,
    }) as any

  const getStorageDescriptor = <
    Name extends string,
    KeyCodecs extends Array<any>,
    Codecs,
  >(
    checksum: string,
    name: Name,
    _: KeyCodecs,
    __: Codecs,
    len: KeyCodecs["length"],
    optional: 0 | 1,
  ): StorageDescriptor<
    DescriptorCommon<Pallet, Name>,
    ArgsWithPayloadCodec<KeyCodecs, Codecs>
  > => ({
    props: { checksum, pallet, name },
    codecs: { len },
    optional,
  })

  const getTxDescriptor = <Name extends string, Codecs extends Array<any>>(
    checksum: string,
    name: Name,
    codecs: Codecs,
  ): TxDescriptor<DescriptorCommon<Pallet, Name>, Codecs> => ({
    props: { checksum, pallet, name },
    codecs,
  })

  return [getPayloadDescriptor, getStorageDescriptor, getTxDescriptor] as const
}
