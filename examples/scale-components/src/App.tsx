import "./App.css"
import { getCodecComponent } from "./Codecs/get-coded-component"
import * as components from "./Codecs/codec-components"
import { metadata } from "@polkadot-api/substrate-bindings"
import rawMetadata from "./raw-metadata"

const FancyComponent = getCodecComponent(components)

const metadataDecoded = metadata.dec(rawMetadata)

function App() {
  return (
    <FancyComponent
      {...{
        metadata: metadataDecoded.metadata.value as any,
        codecType: 93,
        value:
          "0x2705000c88f55be76a094368cc363121267bbd2565d244fee91cd45e8abc514dc2d01000000000",
      }}
    />
  )
}

export default App
