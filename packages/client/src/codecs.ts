import {
  AccountId,
  Codec,
  Decoder,
  DescriptorCommon,
  SS58String,
  StorageDescriptor,
  TxDescriptor,
  V14,
} from "@polkadot-api/substrate-bindings"
import {
  getChecksumBuilder,
  getDynamicBuilder,
} from "@polkadot-api/substrate-codegen"

export interface RuntimeDescriptors {
  storage: Record<
    string,
    Record<
      string,
      {
        enc: (...args: any[]) => string
        dec: Decoder<any>
        keyDecoder: (value: string) => Array<any>
      }
    >
  >
  tx: Record<
    string,
    Record<
      string,
      {
        call: {
          args: Codec<any>
          location: [number, number]
        }
        events: Record<
          string,
          {
            codec: Codec<any>
            location: [number, number]
          }
        >
        errors: Record<
          string,
          {
            codec: Codec<any>
            location: [number, number]
          }
        >
      }
    >
  >
  events: {
    decoder: Decoder<
      Array<{
        phase:
          | { tag: "ApplyExtrinsic"; value: number }
          | { tag: "Finalization" }
          | { tag: "Initialization" }
        event: {
          tag: string
          value: {
            tag: string
            value: any
          }
        }
        topics: Array<any>
      }>
    >
    key: string
  }
  accountId: Codec<SS58String>
}

const filterOut = <T extends { props: DescriptorCommon<string, string> }>(
  input: Array<T>,
  call: Omit<
    ReturnType<typeof getChecksumBuilder>,
    "buildDefinition"
  >[keyof Omit<ReturnType<typeof getChecksumBuilder>, "buildDefinition">],
): Array<T> =>
  input.filter((x) => x.props.checksum === call(x.props.pallet, x.props.name))

export const getCodecsFromMetadata =
  (descriptors: {
    storage: Array<StorageDescriptor<DescriptorCommon<string, string>, any>>
    tx: Array<TxDescriptor<DescriptorCommon<string, string>, any>>
  }) =>
  (metadata: V14): RuntimeDescriptors => {
    const codecs = getDynamicBuilder(metadata)
    const checksums = getChecksumBuilder(metadata)

    const storage: RuntimeDescriptors["storage"] = {}
    const tx: RuntimeDescriptors["tx"] = {}

    filterOut(descriptors.storage, checksums.buildStorage).forEach(
      ({ props: { pallet, name } }) => {
        const palletEntry = storage[pallet] ?? (storage[pallet] = {})
        palletEntry[name] = codecs.buildStorage(pallet, name)
      },
    )

    filterOut(descriptors.tx, checksums.buildCall).forEach(
      ({ props: { pallet, name } }) => {
        const palletEntry = tx[pallet] ?? (tx[pallet] = {})
        palletEntry[name] = palletEntry[name] || {}
        palletEntry[name].call = codecs.buildCall(pallet, name)
      },
    )

    const storageEvents = codecs.buildStorage("System", "Events")

    return {
      storage,
      tx,
      accountId: AccountId(codecs.ss58Prefix),
      events: {
        key: storageEvents.enc(),
        decoder: storageEvents.dec,
      },
    }
  }
