import { getScProvider, WellKnownChain } from "@polkadot-api/sc-provider"
import { blockHeader } from "@polkadot-api/substrate-bindings"
import { createClient } from "@polkadot-api/substrate-client"

const scProvider = getScProvider()
const { relayChain } = scProvider(WellKnownChain.polkadot)

const { chainHead } = createClient(relayChain)

const follower = chainHead(
  true,
  (event) => {
    if (event.type === "initialized") {
      logHeader(event.finalizedBlockHash)
      follower.unpin([event.finalizedBlockHash])
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
