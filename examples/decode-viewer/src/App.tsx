/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import {
  ComplexShape,
  PrimitiveDecoded,
  V14,
  getViewBuilder,
} from "@polkadot-api/substrate-codegen"

import { Button, Grid } from "@polkadot-cloud/react"
import { snakeToCamel } from "@polkadot-cloud/utils"
import { InitStruct, InitStructWithDocs } from "./types"
import { SimpleInput, Input } from "./stories/Input"
import metadata from "./metadata.json"

import "@polkadot-cloud/core/accent/kusama-relay.css"
import "@polkadot-cloud/core/theme/default/index.css"

import "./App.css"

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

interface StructureProps {
  pallet: InitStruct
  call: InitStructWithDocs
}

interface ArgsProps {
  value: any // TODO: StringRecord<Decoded> | Decodeds
  codec: PrimitiveDecoded["codec"] | ComplexShape["codec"]
  innerDocs?: object
  docs?: [string]
  input?: string
  path?: [string]
  tag?: string
}

type KeyValueType = {
  [key: string]: object
}

const ArgsStructure = (args: ArgsProps) => {
  switch (args?.codec) {
    case "Struct": {
      // TODO: Fix the innerDocs
      const { innerDocs } = args
      const some = []
      for (const [k, v] of Object.entries(args?.value as KeyValueType)) {
        const { codec, value, input, docs, path } = v as ArgsProps
        console.log("Struct: codec ===> ", snakeToCamel(k))
        if (codec === "Sequence") {
          some.push(
            <div style={separatorStyle}>
              <div className="struct_title">{snakeToCamel(k)}</div>
              <ArgsStructure
                codec={codec}
                value={value}
                input={input}
                docs={docs}
                path={path}
              />
            </div>,
          )
        } else if (codec === "compactBn") {
          // console.log("compactBn => V:", args?.value)
          some.push(
            <div style={separatorStyle}>
              <Input
                label={k + " : " + codec}
                value={value}
                input={input}
                codec={codec}
                docs={docs}
                disabled
              />
            </div>,
          )
        } else {
          some.push(
            <div style={separatorStyle}>
              <SimpleInput
                label={snakeToCamel(k) + " : " + (path ? path?.join("/") : "")}
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
      }
      return <>{some}</>
    }
    case "Enum": {
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
    }
    case "Sequence": {
      return (
        <div>
          {args.value.map((a: any) => (
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
          ))}
        </div>
      )
    }

    default: {
      // console.log("args", args)
      if (args.tag) {
        // Here all the possibilities must be checked
        const { input, path, codec, value } = args.value
        // console.log("=-=-=-=-=-=-> ", args.value.codec)
        switch (codec) {
          case "AccountId":
            return (
              <Input codec={codec} label={codec} value={value} input={input} />
            )
          case "BytesArray":
            return (
              <Input
                codec={codec}
                label={codec}
                len={args.value.len}
                value={value}
                input={input}
              />
            )

          case "u8":
          case "u16":
          case "u32":
          case "i8":
          case "i16":
          case "i32":
          case "compactNumber":
          case "u64":
          case "u128":
          case "u256":
          case "i64":
          case "i128":
          case "i256":
          case "compactBn":
          case "str":
          case "char":
          case "bool":
          case "bitSequence":
          case "Bytes":
            // console.log("jere?")
            return (
              <Input codec={codec} label={codec} value={value} input={input} />
            )
        }

        const v =
          typeof args.value?.value === "object"
            ? value?.tag || value?.codec
            : value

        // console.log("jere2", value, typeof value?.value)
        return typeof value?.value !== "string" ? (
          <>
            <Input
              codec={codec}
              label={args?.tag + " : " + path?.join("/")}
              value={v}
              input={input}
            />
            <ArgsStructure
              tag={value?.value?.tag}
              codec={value?.value?.codec}
              value={value?.value?.value}
              input={value?.value?.input}
              docs={value?.value?.docs}
              path={value?.value?.path}
            />
          </>
        ) : (
          <Input
            codec={codec}
            label={args?.tag + " : " + path?.join("/")}
            value={v}
            input={input}
          />
        )
        // TODO: Check if this else is needed
        // } else {
        //   // console.log("value={args.value?.value?.tag", args)
        //   // TODO: Fix docs and path if needed
        //   const { codec, value, input, docs, path } = args
        //   return (
        //     <Input
        //       label={codec}
        //       codec={codec}
        //       value={value}
        //       input={input || ""}
        //       docs={docs}
        //     />
        //   )
      }
    }
  }
}

const Structure = ({ pallet, call }: StructureProps) => (
  <Grid row style={Object.assign({}, separatorStyle, { marginTop: "1rem" })}>
    <Grid column md={12} style={separatorStyle}>
      <SimpleInput label={"Decoded call"} value={pallet.value.name} disabled />
      <SimpleInput label={"Call"} value={call.value.name} disabled />
      {call.docs ? (
        <>
          <div className="help_tooltip">
            <Button type="help" outline />
            <span className="help_tooltiptext">
              {call.docs?.map((d) => <span>{d}</span>)}
            </span>
          </div>
        </>
      ) : null}
    </Grid>
  </Grid>
)

export const App = () => {
  const [inputValue, setInputValue] = useState<string>(
    "0x180008040700dc97b0271418c41f80d049826cfb1d6bd2e44e11ea39759addf6b01632ca973d0b00409452a30306050400dc97b0271418c41f80d049826cfb1d6bd2e44e11ea39759addf6b01632ca973d",
    // "0x17002b0f01590100004901415050524f56455f52464328303030352c39636261626661383035393864323933353833306330396331386530613065346564383232376238633866373434663166346134316438353937626236643434290101000000",
  )
  const [err, setErr] = useState<string | null>()

  const [pallet, setPallet] = useState<InitStruct>()
  const [call, setCall] = useState<InitStructWithDocs>()
  const [argsValue, setArgsValue] = useState<any>()

  const decode = (hex: string) => {
    try {
      const { callDecoder } = getViewBuilder(metadata as V14)
      const result = callDecoder(hex)
      // Print all the text
      // // console.log(result)

      const {
        pallet,
        call,
        args: { value },
      } = result
      setPallet(pallet)
      setCall(call)
      setArgsValue(value)
      // console.log("value", value)
    } catch (e: any) {
      // console.log("error ", e)
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
