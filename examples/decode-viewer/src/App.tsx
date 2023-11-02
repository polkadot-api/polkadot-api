import { Input } from "./stories/Input"
import "./App.css"
import { useEffect, useState } from "react"
// import sampleData from "./sample.json"
import { _void, str, Struct } from "@polkadot-api/substrate-bindings"

export const App = () => {
  const [typed, setTyped] = useState<string | undefined>()

  useEffect(() => {}, [])
  return (
    <>
      <Input
        codec={"_void"}
        label={""}
        value={undefined}
        input={""}
        meta={{ path: [], docs: "" }}
      />
    </>
  )
}

export default App
