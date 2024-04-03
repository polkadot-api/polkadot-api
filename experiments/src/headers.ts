import { getScProvider } from "@polkadot-api/sc-provider"
import { WellKnownChain, createScClient } from "@substrate/connect"
import { blockHeader } from "@polkadot-api/substrate-bindings"
import { createClient } from "@polkadot-api/substrate-client"

const scProvider = getScProvider(createScClient())
const { relayChain } = scProvider(WellKnownChain.polkadot)

const { chainHead } = createClient(relayChain)

const follower = chainHead(
  true,
  (event) => {
    if (event.type === "initialized") {
      logHeader(event.finalizedBlockHashes.at(-1)!)
      follower.unpin([event.finalizedBlockHashes.at(-1)!])
      return
    }

    if (event.type !== "finalized") return

    event.finalizedBlockHashes.forEach(logHeader)

    follower.unpin([...event.prunedBlockHashes, ...event.finalizedBlockHashes])
  },
  (e) => {
    console.error(e)
  },
)

const logHeader = (hash: string) =>
  follower
    .header(hash)
    .then(blockHeader.dec)
    .then((x) => console.log(JSON.stringify(x, null, 2)))
