import "./App.css"
import { TransferrableBalance } from "./TransferrableBalance"
import { BlockNumbers } from "./BlockNumbers"
import { ChainProvider, MainProvider } from "./context"
import { Teleport } from "./Teleport"
import { paraChainApi, paraChain, relayChain, relayChainApi } from "./api"

function App() {
  return (
    <MainProvider>
      <ChainProvider value={{ client: relayChain, api: relayChainApi }}>
        <h2>Westend Relay Chain</h2> <BlockNumbers />
        <TransferrableBalance />
      </ChainProvider>
      <Teleport />
      <ChainProvider value={{ client: paraChain, api: paraChainApi }}>
        <h2>Westend AssetHub</h2> <BlockNumbers />
        <TransferrableBalance />
      </ChainProvider>
    </MainProvider>
  )
}

export default App
