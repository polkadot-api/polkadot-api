import { WellKnownChain } from "@substrate/connect"
import { ScProvider } from "@unstoppablejs/sc-provider"
import { createClient } from "@capi-dev/substrate-client"
import {
  compact,
  metadata,
  CodecType,
  Tuple,
} from "@capi-dev/substrate-bindings"

const smProvider = ScProvider(
  WellKnownChain.polkadot /*, {
  embeddedNodeConfig: {
    maxLogLevel: 9,
  },
}*/,
)

export interface Provider {
  send: (message: string) => void
  open: () => void
  close: () => void
}
export declare enum ProviderStatus {
  ready = 0,
  disconnected = 1,
  halt = 2,
}

export declare type GetProvider = (
  onMessage: (message: string) => void,
  onStatus: (status: ProviderStatus) => void,
) => Provider

const withLogsProvider = (input: GetProvider): GetProvider => {
  return (onMsg, onStatus) => {
    const result = input(
      (msg) => {
        console.log("<< " + msg)
        onMsg(msg)
      },
      (status) => {
        console.log("STATUS CHANGED =>" + status)
        onStatus(status)
      },
    )

    return {
      ...result,
      send: (msg) => {
        console.log(">> " + msg)
        result.send(msg)
      },
    }
  }
}

export const { chainHead } = createClient(withLogsProvider(smProvider))

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
