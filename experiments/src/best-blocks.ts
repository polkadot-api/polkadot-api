import { getObservableClient } from "@polkadot-api/observable-client"
import { getScProvider } from "@polkadot-api/sc-provider"
import { WellKnownChain, createScClient } from "@substrate/connect"
import { createClient } from "@polkadot-api/substrate-client"

const scProvider = getScProvider(createScClient())
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
