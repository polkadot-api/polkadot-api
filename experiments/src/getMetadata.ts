import {
  getScProvider,
  WellKnownChain,
  ConnectProvider,
} from "@polkadot-api/sc-provider"
import { createClient } from "@polkadot-api/substrate-client"
import {
  compact,
  metadata,
  CodecType,
  Tuple,
  Option,
  u32,
} from "@polkadot-api/substrate-bindings"
import { toHex } from "@polkadot-api/utils"

const scProvider = getScProvider()

const smProvider = scProvider(
  WellKnownChain.polkadot /*, {
  embeddedNodeConfig: {
    maxLogLevel: 9,
  },
}*/,
).relayChain

const withLogsProvider = (input: ConnectProvider): ConnectProvider => {
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

export const { chainHead } = createClient(withLogsProvider(smProvider))

type Metadata = CodecType<typeof metadata>

const opaqueMeta = Option(Tuple(compact, metadata))

export const getMetadata = (): Promise<Metadata> =>
  new Promise<Metadata>((res, rej) => {
    let requested = false
    const chainHeadFollower = chainHead(
      true,
      (message) => {
        if (message.type === "newBlock") {
          chainHeadFollower.unpin([message.blockHash])
          return
        }
        if (requested || message.type !== "initialized") return
        const latestFinalized = message.finalizedBlockHash
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
            res(metadata)
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

/*
const result = await getMetadata()
console.log(result)

await writeFile("./v15.json", JSON.stringify(result, null, 2))
console.log("done")
*/
