import {
  Decoder,
  DescriptorCommon,
  StorageDescriptor,
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
}

export const getCodecsFromMetadata =
  (descriptors: {
    storage: Array<StorageDescriptor<DescriptorCommon<string, string>, any>>
  }) =>
  (metadata: V14) => {
    const codecs = getDynamicBuilder(metadata)
    const checksums = getChecksumBuilder(metadata)

    const storage: RuntimeDescriptors["storage"] = {}

    descriptors.storage
      .filter(
        (x) =>
          x.props.checksum ===
          checksums.buildStorage(x.props.pallet, x.props.name),
      )
      .forEach(({ props: { pallet, name } }) => {
        const palletEntry = storage[pallet] ?? (storage[pallet] = {})
        palletEntry[name] = codecs.buildStorage(pallet, name)
      })

    return {
      storage,
    }
  }
