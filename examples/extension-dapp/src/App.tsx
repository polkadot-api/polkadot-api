import { useCallback, useEffect, useState } from "react"
import {
  provider,
  type JsonRpcProvider,
} from "@polkadot-api/light-client-extension-helpers/web-page"
import { createClient } from "@polkadot-api/substrate-client"

import westend from "./chainspecs/westend2.json?raw"
import polkadot from "./chainspecs/polkadot.json?raw"
import ksmcc3 from "./chainspecs/ksmcc3.json?raw"

import "./App.css"

function App() {
  const [updatedChains, setUpdatedChains] = useState("")
  useEffect(
    () =>
      provider.onChainsChange((rawChains) => {
        setUpdatedChains(JSON.stringify(rawChains))
      }),
    [],
  )
  const handleAddChainPolkadot = useCallback(async () => {
    try {
      const chain = await provider.addChain(polkadot)
      console.log("provider.addChain()", chain)

      const client = createClient((onMessage, onStatus) => {
        let jsonProvider: JsonRpcProvider | undefined
        return {
          open() {
            chain
              .connect(onMessage, onStatus)
              .then((provider) => {
                jsonProvider = provider
                onStatus("connected")
              })
              .catch((error) => {
                console.error("custom provider", error)
                onStatus("disconnected")
              })
          },
          close() {
            jsonProvider?.disconnect()
          },
          send(message) {
            jsonProvider?.send(message)
          },
        }
      })
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
      console.log("provider.addChain()", await provider.addChain(ksmcc3))
    } catch (error) {
      console.error("provider.addChain()", error)
    }
  }, [])
  const handleAddChainWestend = useCallback(async () => {
    try {
      console.log("provider.addChain()", await provider.addChain(westend))
    } catch (error) {
      console.error("provider.addChain()", error)
    }
  }, [])
  const handleGetChains = useCallback(async () => {
    try {
      console.log("provider.getChains()", await provider.getChains())
    } catch (error) {
      console.error("provider.getChains()", error)
    }
  }, [])
  return (
    <>
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
        <button onClick={handleGetChains}>Get Chains</button>
      </div>
      <div>
        <div>Updated Chains</div>
        <pre>{updatedChains}</pre>
      </div>
    </>
  )
}

export default App
