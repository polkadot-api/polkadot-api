/* eslint-disable @typescript-eslint/no-explicit-any */
import { SimpleInput, Input as PerInput } from "./stories/Input"
import "./App.css"
import {
  useEffect,
  useState,
  // useState
} from "react"
import metadata from "./metadata.json"
import { getViewBuilder } from "@polkadot-api/substrate-codegen"

// const doSomething = (result: object) => {
//   if (key === "codec") {
//     Struct(value)
//     console.log("val", value)
//   }
//   if (key === "codec") {
//     console.log("val", value)
//   }
//   if (key === "input") {
//     console.log("val", value)
//   }
// }

const Structure = ({ input }: any) => {
  const value = input[1]
  console.log("value", value)
  if (input.tag) {
    return <SimpleInput label={input.tag} value={input.value} />
  } else {
    console.log("k", input[1])
    return (
      <PerInput label={input.tag} value={input.value} codec={"u8"} input={""} />
    )
  }
}

export const App = () => {
  const [result, setResult] = useState<any>()
  const [inputValue, setInputValue] = useState<string>("")
  const [err, setErr] = useState<string | null>()
  const [firstLevel, setFirstLevel] = useState<any>()

  const decode = (hex: string) => {
    try {
      const { callDecoder } = getViewBuilder(metadata)
      const result = callDecoder(hex)
      console.log("STRING", result)
      setResult(result.args.value)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.log("error ", e)
      setErr(e.message)
    }
  }

  useEffect(() => {
    if (result) {
      setFirstLevel(result?.value)
    }
    if (err) {
      setResult(null)
      setFirstLevel(null)
    }
  }, [err, result])

  // 0x17002b0f01590100004901415050524f56455f52464328303030352c39636261626661383035393864323933353833306330396331386530613065346564383232376238633866373434663166346134316438353937626236643434290101000000
  return (
    <>
      <div className="top-stuff"></div>
      <h3>Something</h3>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <SimpleInput
          label={"hex-encoded call"}
          value={inputValue}
          onChange={(e: any) => setInputValue(e.target.value)}
        />
        <button
          className="hex-button"
          onClick={() => {
            setErr(null)
            decode(inputValue)
          }}
        >
          Decode stuff
        </button>
      </div>
      <div className="bottom-stuff">
        <div className="error">{err}</div>
        {firstLevel &&
          Object.entries(firstLevel).map((val) => {
            console.log("firstLevel", val)
            if (val) {
              return <Structure input={val} />
            } else {
              return null
            }
          })}
      </div>
    </>
  )
}

export default App
