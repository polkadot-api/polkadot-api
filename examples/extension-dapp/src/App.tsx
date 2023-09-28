import { useCallback, useEffect, useState } from "react"
import { provider } from "@polkadot-api/light-client-extension-helpers/web-page"

import "./App.css"

function App() {
  const [updatedChains, setUpdatedChains] = useState("")
  useEffect(
    () =>
      provider.onChainsChange((rawChain) => {
        const { genesisHash, name } = rawChain
        setUpdatedChains(JSON.stringify({ genesisHash, name }))
      }),
    [],
  )
  const handleAddChain = useCallback(async () => {
    try {
      console.log(
        "provider.addChain()",
        await provider.addChain("some-chainspec"),
      )
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
        <button onClick={handleAddChain}>Add Chain</button>
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
