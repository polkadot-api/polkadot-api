import "./App.css"
import { Balance } from "./Balance"
import { BlockNumber } from "./BlocNumber"
import { ChainProvider, MainProvider } from "./Providers"
import { Teleport } from "./Teleport"
import { paraChainApi, paraChain, relayChain, relayChainApi } from "./api"

function App() {
  return (
    <MainProvider>
      <ChainProvider
        value={{
          chain: relayChain,
          api: relayChainApi,
        }}
      >
        <h2>
          Polkadot Relay Chain: (#
          <BlockNumber type="finalized" /> - #<BlockNumber type="best" />)
        </h2>
        <Balance />
      </ChainProvider>
      <Teleport />
      <ChainProvider
        value={{
          chain: paraChain,
          api: paraChainApi,
        }}
      >
        <h2>
          AssetHub (#
          <BlockNumber type="finalized" /> - #<BlockNumber type="best" />)
        </h2>
        <Balance />
      </ChainProvider>
    </MainProvider>
  )
}

export default App
