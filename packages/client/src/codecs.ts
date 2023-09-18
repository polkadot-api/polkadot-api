import { FollowResponse } from "@polkadot-api/substrate-client"
import {
  Decoder,
  DescriptorCommon,
  StorageDescriptor,
  Tuple,
  V14,
  compact,
  metadata,
} from "@polkadot-api/substrate-bindings"
import { Observable, map } from "rxjs"
import {
  getChecksumBuilder,
  getDynamicBuilder,
} from "@polkadot-api/substrate-codegen"
import { fromAbortControllerFn } from "./utils"

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

const getCodecsFromMetadata =
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

const opaqueMeta = Tuple(compact, metadata)

export const getCodecs$ = (
  follower: FollowResponse,
  descriptors: {
    storage: Array<StorageDescriptor<DescriptorCommon<string, string>, any>>
  },
  latestBlock: string,
): Observable<RuntimeDescriptors> =>
  fromAbortControllerFn(follower.call)(
    latestBlock,
    "Metadata_metadata",
    "",
  ).pipe(
    map((response) => {
      const metadata = opaqueMeta.dec(response)[1]
      if (metadata.metadata.tag !== "v14")
        throw new Error("Wrong metadata version")
      return metadata.metadata.value
    }),
    map(getCodecsFromMetadata(descriptors)),
  )
