import { WellKnownChain } from "@substrate/connect"
import { ScProvider } from "@unstoppablejs/sc-provider"
import { createClient } from "@unstoppablejs/substrate-client"
import {
  compact,
  metadata,
  CodecType,
  Tuple,
} from "@unstoppablejs/substrate-bindings"

const smProvider = ScProvider(
  WellKnownChain.polkadot /*, {
  embeddedNodeConfig: {
    maxLogLevel: 9,
  },
}*/,
)

export const { chainHead } = createClient(smProvider)

type Metadata = CodecType<typeof metadata>

const opaqueMeta = Tuple(compact, metadata)

export const getMetadata = (): Promise<Metadata> =>
  new Promise<Metadata>((res, rej) => {
    let requested = false
    const chainHeadFollower = chainHead(true, (message) => {
      if (message.event === "finalized") {
        const latestFinalized =
          message.finalizedBlockHashes[message.finalizedBlockHashes.length - 1]
        if (requested) return
        requested = true
        chainHeadFollower
          .call(latestFinalized, "Metadata_metadata", "")
          .then((response) => {
            const [, metadata] = opaqueMeta.dec(response)
            res(metadata)
          })
          .catch((e) => {
            console.log("error", e)
            rej(e)
          })
          .finally(() => {
            chainHeadFollower.unfollow()
          })
      }
    })
  })
