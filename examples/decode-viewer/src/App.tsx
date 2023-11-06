/* eslint-disable @typescript-eslint/no-explicit-any */
import { SimpleInput, Input as IInput } from "./stories/Input"
import "./App.css"
import { useEffect, useState } from "react"
import metadata from "./metadata.json"
import { V14, getViewBuilder } from "@polkadot-api/substrate-codegen"
import { InitStruct } from "./types"

import "@polkadot-cloud/core/accent/kusama-relay.css"
import "@polkadot-cloud/core/theme/default/index.css"
import { Button, Grid } from "@polkadot-cloud/react"

const buttonStyle = {
  background: "#424242",
  padding: "0.5rem 1rem",
  width: "15rem",
}

const separatorStyle = {
  border: "0.1rem dashed #999",
  padding: "0.2rem",
  TextAlign: "center",
}

// TypeGuard just in case
// const isInitStruct = (obj: any): obj is InitStruct => {
//   return (
//     !!Object.keys(obj).length &&
//     !!Object.keys(obj.value).length &&
//     typeof obj.value == "object" &&
//     !!obj.value.idx &&
//     typeof obj.value.idx === "number" &&
//     !!obj.input &&
//     typeof obj.input === "string"
//   )
// }

interface StructureProps {
  pallet: InitStruct
  call: InitStruct
}

interface ArgsProps {
  value: any // StringRecord<Decoded> | Decodeds
  codec: any
  innerDocs?: object
  docs?: [string]
  input?: string
  path?: [string]
  tag?: string
}

type KeyValueType = {
  [key: string]: object
}

let count = 1

const ArgsStructure = (args: ArgsProps) => {
  console.log("count", count++)
  if (args?.codec === "Struct") {
    const some = []
    for (const [k, v] of Object.entries(args?.value as KeyValueType)) {
      const { codec, value, input, docs, path } = v as ArgsProps
      some.push(
        <div style={separatorStyle}>
          <SimpleInput
            style={{ borderRadius: "0" }}
            label={k + ":" + path?.join("/")}
            value={value.tag}
            disabled
          />
          <ArgsStructure
            codec={codec}
            value={value}
            input={input}
            docs={docs}
            path={path}
          />
        </div>,
      )
    }
    return <>{some}</>
  } else if (args?.codec === "Enum") {
    const nextContent = args.value.value
    const { input, docs, path, codec, tag } = args.value
    return (
      <div style={{ marginLeft: "1rem" }}>
        <ArgsStructure
          tag={tag}
          codec={codec}
          value={nextContent}
          input={input}
          docs={docs}
          path={path}
        />
      </div>
    )
  } else if (args.tag) {
    // check
    const { input, path, codec, value } = args.value

    console.log("args :--- :-- : ", args)
    let v = ""
    if (typeof args.value?.value === "object") {
      v = value?.tag || value?.codec
    } else {
      v = value
    }
    return (
      <IInput
        codec={codec}
        label={args?.tag + ":" + path?.join("/")}
        value={v}
        input={input}
      />
    )
  } else {
    if (typeof args.value === "object" && args.value.length > 0) {
      return args.value.map((a) => (
        <div style={{ marginLeft: "1rem" }}>
          <ArgsStructure
            tag={a.tag}
            codec={a.codec}
            value={a.value}
            input={a.input}
            docs={a.docs}
            path={a.path}
          />
        </div>
      ))
    } else {
      console.log("value={args.value?.value?.tag", args.value)
      return (
        <IInput
          codec={args.value?.codec}
          label={args?.value?.codec}
          value={args.value?.value?.tag}
          input={args.value?.input}
        />
      )
    }
  }
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
  const [inputValue, setInputValue] = useState<string>(
    "0x180008040700dc97b0271418c41f80d049826cfb1d6bd2e44e11ea39759addf6b01632ca973d0b00409452a30306050400dc97b0271418c41f80d049826cfb1d6bd2e44e11ea39759addf6b01632ca973d",
    // "0x17002b0f01590100004901415050524f56455f52464328303030352c39636261626661383035393864323933353833306330396331386530613065346564383232376238633866373434663166346134316438353937626236643434290101000000",
  )
  const [err, setErr] = useState<string | null>()

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
    if (err) {
      setPallet(undefined)
      setCall(undefined)
      setArgsValue(undefined)
    }
  }, [err])

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
        {argsValue ? (
          <ArgsStructure
            value={argsValue.value}
            codec={argsValue.codec}
            innerDocs={argsValue.innerDocs}
            input={argsValue.input}
          />
        ) : null}
      </div>
    </>
  )
}

export default App
