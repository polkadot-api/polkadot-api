import { getObservableClient } from "@polkadot-api/client"
import { getScProvider, WellKnownChain } from "@polkadot-api/sc-provider"
import { createClient } from "@polkadot-api/substrate-client"

const scProvider = getScProvider()
const { relayChain } = scProvider(WellKnownChain.polkadot)

const client = getObservableClient(createClient(relayChain))

const chainHead = client.chainHead$()

chainHead.bestBlocks$.subscribe({
  next(v) {
    console.log(v)
  },
  error(e) {
    console.error(e)
  },
})
