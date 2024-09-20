import "./App.css"
import { getCodecComponent } from "./Codecs/get-coded-component"
import * as components from "./Codecs/codec-components"
import { metadata } from "@polkadot-api/substrate-bindings"
import rawMetadata from "./raw-metadata"

const FancyComponent = getCodecComponent(components)

const metadataDecoded = metadata.dec(rawMetadata)

function App() {
  const input1 =
    "0x2705000c88f55be76a094368cc363121267bbd2565d244fee91cd45e8abc514dc2d01000000000"
  const input2 =
    "0x050300d6ebcc75c7ea9a0c4459162b495e90c7ed5306e3a27f73125d6fbd2a346013230b002445cd360b"
  const input3 = "0x63020400000400000408000000000000000000000000"

  const selected = input3
  return (
    <>
      <h1 className="text-lg my-5">Decoding: {selected}</h1>
      <FancyComponent
        {...{
          metadata: metadataDecoded.metadata.value as any,
          codecType: 93,
          value: selected,
        }}
      />
    </>
  )
}

export default App
