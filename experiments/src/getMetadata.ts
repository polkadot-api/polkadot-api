import { getScProvider, JsonRpcProvider } from "@polkadot-api/sc-provider"
import { WellKnownChain, createScClient } from "@substrate/connect"
import { Runtime, createClient } from "@polkadot-api/substrate-client"
import {
  compact,
  metadata,
  CodecType,
  Tuple,
  Option,
  u32,
} from "@polkadot-api/substrate-bindings"
import { toHex } from "@polkadot-api/utils"

const scProvider = getScProvider(createScClient())

const smProvider = scProvider(
  WellKnownChain.polkadot /*, {
  embeddedNodeConfig: {
    maxLogLevel: 9,
  },
}*/,
).relayChain

const withLogsProvider = (input: JsonRpcProvider): JsonRpcProvider => {
  return (onMsg) => {
    const result = input((msg) => {
      console.log("<< " + msg)
      onMsg(msg)
    })

    return {
      ...result,
      send: (msg) => {
        console.log(">> " + msg)
        result.send(msg)
      },
    }
  }
}

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
    const { chainHead } = createClient(provider)

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
          })
      },
      () => {},
    )
  })

export const getMetadata = () =>
  getMetadataFromProvider(withLogsProvider(smProvider))

/*
const result = await getMetadata()
console.log(result)

await writeFile("./v15.json", JSON.stringify(result, null, 2))
console.log("done")
*/
