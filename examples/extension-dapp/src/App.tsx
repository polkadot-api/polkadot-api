import { useCallback, useEffect, useState } from "react"
import {
  getLightClientProvider,
  type RawChain,
} from "@polkadot-api/light-client-extension-helpers/web-page"
import { createClient } from "@polkadot-api/substrate-client"
import { getObservableClient } from "@polkadot-api/client"

import polkadot from "./chainspecs/polkadot.json?raw"
import ksmcc3 from "./chainspecs/ksmcc3.json?raw"
import westend from "./chainspecs/westend2.json?raw"
import westmint from "./chainspecs/westend-westmint.json?raw"

const westendGenesisHash =
  "0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e"

const rawChainsToHuman = (rawChains: Record<string, RawChain>) =>
  JSON.stringify(
    Object.values(rawChains).map(({ name, genesisHash }) => [
      name,
      `${genesisHash.substring(0, 6)}..${genesisHash.substring(
        genesisHash.length - 4,
      )}`,
    ]),
    undefined,
    2,
  )

const provider = await getLightClientProvider("some-random-id")

function App() {
  const [updatedChains, setUpdatedChains] = useState("")
  const [getChains, setGetChains] = useState("")
  useEffect(
    () =>
      provider.addChainsChangeListener((rawChains) => {
        setUpdatedChains(rawChainsToHuman(rawChains))
      }),
    [],
  )
  const handleAddChainPolkadot = useCallback(async () => {
    try {
      const chain = await provider.getChain(polkadot)
      console.log("provider.addChain()", chain)
      const client = createClient(chain.connect)
      let count = 0
      const follower = client.chainHead(
        true,
        (event) => {
          if (count === 5) {
            follower.unfollow()
            client.destroy()
          }
          console.log(`chainHead event#${count++}`, event)
        },
        (error) => console.error(error),
      )
    } catch (error) {
      console.error("provider.addChain()", error)
    }
  }, [])
  const handleAddChainKusama = useCallback(async () => {
    try {
      console.log("provider.addChain()", await provider.getChain(ksmcc3))
    } catch (error) {
      console.error("provider.addChain()", error)
    }
  }, [])
  const handleAddChainWestend = useCallback(async () => {
    try {
      const chain = await provider.getChain(westend)
      console.log("provider.addChain()", chain)
    } catch (error) {
      console.error("provider.addChain()", error)
    }
  }, [])
  const handleAddChainWestmint = useCallback(async () => {
    try {
      const chain = await provider.getChain(westmint, westendGenesisHash)
      console.log("provider.addChain()", chain)

      const client = createClient(chain.connect)
      let count = 0
      const follower = client.chainHead(
        true,
        (event) => {
          if (count === 5) {
            follower.unfollow()
            client.destroy()
          }
          console.log(`chainHead event#${count++}`, event)
        },
        (error) => console.error(error),
      )
    } catch (error) {
      console.error("provider.addChain()", error)
    }
  }, [])
  const handleGetChains = useCallback(async () => {
    try {
      const chains = await provider.getChains()
      console.log("provider.getChains()", chains)
      setGetChains(rawChainsToHuman(chains))
    } catch (error) {
      console.error("provider.getChains()", error)
    }
  }, [])
  const [polkadotFinalized, setPolkadotFinalized] = useState<string>()
  const handleFollowPolkadotFinalized = useCallback(async () => {
    setPolkadotFinalized("...")
    const chain = await provider.getChain(polkadot)
    const client = getObservableClient(createClient(chain.connect))
    client.chainHead$().finalized$.subscribe(setPolkadotFinalized)
  }, [])
  return (
    <main className="container">
      <h1>Extension Test DApp</h1>
      <div>Actions</div>
      <div>
        <button onClick={handleAddChainPolkadot}>Add Polkadot Chain</button>
      </div>
      <div>
        <button onClick={handleAddChainKusama}>Add Kusama Chain</button>
      </div>
      <div>
        <button onClick={handleAddChainWestend}>Add Westend Chain</button>
      </div>
      <div>
        <button onClick={handleAddChainWestmint}>Add Westmint Chain</button>
      </div>
      <div>
        <button onClick={handleGetChains}>Get Chains</button>
      </div>
      <div>
        {polkadotFinalized ? (
          <div>Polkadot finalized {polkadotFinalized}</div>
        ) : (
          <button onClick={handleFollowPolkadotFinalized}>
            Follow Polkadot Finalized
          </button>
        )}
      </div>
      <div>
        <div>Get Chains</div>
        <pre>{getChains}</pre>
      </div>
      <div>
        <div>Updated Chains</div>
        <pre>{updatedChains}</pre>
      </div>
    </main>
  )
}

export default App
