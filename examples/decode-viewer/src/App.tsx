/* eslint-disable @typescript-eslint/no-explicit-any */
import { SimpleInput, Input as MainInput } from "./stories/Input"
import "./App.css"
import { useEffect, useState } from "react"
import metadata from "./metadata.json"
import { V14, getViewBuilder } from "@polkadot-api/substrate-codegen"
import { InitStruct } from "./types"

import "@polkadot-cloud/core/accent/kusama-relay.css"
import "@polkadot-cloud/core/theme/default/index.css"
import { Button, Grid } from "@polkadot-cloud/react"

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

const buttonStyle = {
  background: "black",
  padding: "0.5rem 1rem",
  width: "15rem",
}

const separatorStyle = {
  border: "0.1rem dashed #999",
  padding: "0.5rem",
  TextAlign: "center",
}

const isInitStruct = (obj: any): obj is InitStruct => {
  return (
    !!Object.keys(obj).length &&
    !!Object.keys(obj.value).length &&
    typeof obj.value == "object" &&
    !!obj.value.idx &&
    typeof obj.value.idx === "number" &&
    !!obj.input &&
    typeof obj.input === "string"
  )
}

interface StructureProps {
  pallet: InitStruct
  call: InitStruct
}

const ArgsStructure = ({ args }: any) => {
  console.log("args", args)
  return (
    <Grid row style={separatorStyle}>
      <Grid column md={12} style={separatorStyle}>
        Something
      </Grid>
    </Grid>
  )
}

const Structure = ({ pallet, call }: StructureProps) => {
  return (
    <Grid row style={Object.assign({}, separatorStyle, { marginTop: "1rem" })}>
      <Grid column md={12} style={separatorStyle}>
        <SimpleInput
          style={{ borderRadius: "0" }}
          label={"Decoded call"}
          value={pallet.value.name}
          disabled
        />
        <SimpleInput
          style={{ borderRadius: "0" }}
          label={"Call"}
          value={call.value.name}
          disabled
        />
        {call?.docs ? (
          <div className="help_tooltip">
            <Button type="help" />
            <span className="help_tooltiptext">
              {call?.docs?.map((d) => <span>{d}</span>)}
            </span>
          </div>
        ) : null}
      </Grid>
    </Grid>
  )
}

export const App = () => {
  const [result, setResult] = useState<any>()
  const [inputValue, setInputValue] = useState<string>(
    "0x17002b0f01590100004901415050524f56455f52464328303030352c39636261626661383035393864323933353833306330396331386530613065346564383232376238633866373434663166346134316438353937626236643434290101000000",
  )
  const [err, setErr] = useState<string | null>()
  const [firstLevel, setFirstLevel] = useState<any>()

  const [pallet, setPallet] = useState<InitStruct>()
  const [call, setCall] = useState<InitStruct>()
  const [argsValue, setArgsValue] = useState<any>()

  const decode = (hex: string) => {
    try {
      const { callDecoder } = getViewBuilder(metadata as V14)
      const result = callDecoder(hex)
      // Print all the text
      // console.log(JSON.stringify(result))
      const {
        pallet,
        call,
        args: { value },
      } = result
      setPallet(pallet)
      setCall(call)
      setArgsValue(value)
      console.log("value", value)
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
      <h3>Decoder View</h3>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <SimpleInput
          label={"hex-encoded call"}
          value={inputValue}
          onChange={(e: any) => setInputValue(e.target.value)}
        />
        <Button
          lg
          style={buttonStyle}
          text="Decode stuff"
          onClick={() => {
            setErr(null)
            decode(inputValue)
          }}
        />
      </div>
      <div className="bottom-stuff">
        <div className="error">{err}</div>
        {pallet && call ? <Structure pallet={pallet} call={call} /> : null}
        {argsValue ? <ArgsStructure args={argsValue} /> : null}
      </div>
    </>
  )
}

export default App
