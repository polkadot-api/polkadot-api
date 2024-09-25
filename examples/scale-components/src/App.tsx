import "./App.css"
import { metadata } from "@polkadot-api/substrate-bindings"
import rawMetadata from "./raw-metadata"
import { ViewCodec } from "./Codecs/components"

const metadataDecoded = metadata.dec(rawMetadata)

function App() {
  const input1 =
    "0x2705000c88f55be76a094368cc363121267bbd2565d244fee91cd45e8abc514dc2d01000000000"
  const input2 =
    "0x050300d6ebcc75c7ea9a0c4459162b495e90c7ed5306e3a27f73125d6fbd2a346013230b002445cd360b"
  const lists = "0x63020400000400000408000000000000000000000000"
  const accounts =
    "0x050200d6ebcc75c7ea9a0c4459162b495e90c7ed5306e3a27f73125d6fbd2a3460132300d6ebcc75c7ea9a0c4459162b495e90c7ed5306e3a27f73125d6fbd2a3460132300"
  const hexBinary = "0x1a050000081110821a060042600a00"
  const textBinary = "0x1a0500001468656c6c6f0000"
  const selected = lists

  return (
    <div className="flex flex-col items-center max-w-screen-md">
      <h1 className="text-lg my-5 text-wrap break-all">Decoding: {selected}</h1>
      <ViewCodec
        {...{
          metadata: metadataDecoded.metadata.value as any,
          codecType: 93,
          value: selected,
        }}
      />
    </div>
  )
}

export default App
