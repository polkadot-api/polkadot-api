import { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import {
  CodecType,
  compact,
  metadata,
  Option,
  Tuple,
  u32,
} from "@polkadot-api/substrate-bindings"
import { Runtime, createClient } from "@polkadot-api/substrate-client"
import { toHex } from "@polkadot-api/utils"

type Metadata = CodecType<typeof metadata>

const opaqueMeta = Option(Tuple(compact, metadata))

export const getMetadataFromProvider = (
  provider: JsonRpcProvider,
): Promise<
  Metadata & {
    runtime: Runtime
  }
> =>
  new Promise<
    Metadata & {
      runtime: Runtime
    }
  >((res, rej) => {
    const { chainHead, destroy } = createClient(provider)

    let requested = false
    const chainHeadFollower = chainHead(
      true,
      (message) => {
        if (message.type === "newBlock") {
          chainHeadFollower.unpin([message.blockHash])
          return
        }
        if (requested || message.type !== "initialized") return
        const latestFinalized = message.finalizedBlockHashes.at(-1)!
        if (requested) return
        requested = true

        // TODO: migrate to potential metadata v16
        chainHeadFollower
          .call(
            latestFinalized,
            "Metadata_metadata_at_version",
            toHex(u32.enc(15)),
          )
          .then((response) => {
            const [, metadata] = opaqueMeta.dec(response)!
            res({ ...metadata, runtime: message.finalizedBlockRuntime })
          })
          .catch((e) => {
            console.log("error", e)
            rej(e)
          })
          .finally(() => {
            chainHeadFollower.unfollow()
            destroy()
          })
      },
      () => {},
    )
  })
