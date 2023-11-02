import { FC, useState } from "react"
import {
  AccountIdDecoded,
  BigNumberDecoded,
  BitSequenceDecoded,
  BoolDecoded,
  BytesArrayDecoded,
  BytesSequenceDecoded,
  NumberDecoded,
  StringDecoded,
  VoidDecoded,
} from "./types"

import "./index.scss"

type SimpleType =
  | VoidDecoded["codec"]
  | BoolDecoded["codec"]
  | StringDecoded["codec"]
  | NumberDecoded["codec"]
  | BigNumberDecoded["codec"]

type NotSoSimpleType =
  | BitSequenceDecoded["codec"]
  | BytesSequenceDecoded["codec"]
  | BytesArrayDecoded["codec"]
  | AccountIdDecoded["codec"]

interface InputProps {
  codec: SimpleType | NotSoSimpleType
}

interface SimpleInputProps {
  label: string
  value: any
  len?: number
  smaller?: boolean
}

interface CommonProps {
  input: string
  meta?: MetaProps
}

interface MetaProps {
  path: string[]
  docs: string
}

type FullProps = InputProps & SimpleInputProps & CommonProps

const extraInput = ({ input, meta }: CommonProps) => {
  const [show, setShow] = useState<boolean>(false)
  return (
    (input || meta?.docs || meta?.path) && (
      <>
        <div
          style={{
            display: show ? "block" : "none",
            margin: "0.5rem 0 0 1rem",
          }}
        >
          {input && <SimpleInput value={input} label={"Input"} smaller />}
          {meta?.path?.length && (
            <SimpleInput value={meta?.path?.join("/")} label={"Path"} smaller />
          )}
          {meta?.docs?.length && (
            <SimpleInput value={meta?.docs} label={"Docs"} smaller />
          )}
        </div>
        <button className="show-button" onClick={() => setShow(!show)}>
          {show ? "Hide" : "Show"}
        </button>
      </>
    )
  )
}

const SimpleInput = ({ label, value, smaller }: SimpleInputProps) => (
  <div className={`custom-input-wrapper${smaller ? " smaller" : ""}`}>
    {label && <div className="label">{label}</div>}
    <input disabled id={Math.random().toString()} value={value} />
  </div>
)

export const Input: FC<FullProps> = ({
  codec,
  value,
  len,
  input,
  meta,
  label,
}: FullProps) => {
  let inputValue = value
  console.log(input, meta)

  switch (codec) {
    // Here are Simple components that needs more than one input
    case "AccountId":
    case "bitSequence": {
      const entries = Object.entries(inputValue)
      return (
        <>
          <div className="multiple">
            {entries?.map((entry) => (
              <SimpleInput
                label={entry[0]}
                value={entry[1]}
                {...{ input, meta }}
              />
            ))}
          </div>
          {extraInput({ input, meta })}
        </>
      )
    }
    // Here are Simple components
    case "Bytes": {
      inputValue = "[" + Uint8Array.from(Object.values(value)) + "]"
      break
    }
    case "BytesArray": {
      return (
        <div className="multiple">
          <SimpleInput label={label} value={inputValue} {...{ input, meta }} />
          <SimpleInput label={"len"} value={len} {...{ input, meta }} />
          {extraInput({ input, meta })}
        </div>
      )
    }
    // Default ones
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
      inputValue = value.toString()
      break
  }

  return (
    <>
      <SimpleInput label={label} value={inputValue} {...{ input, meta }} />
      {extraInput({ input, meta })}
    </>
  )
}
