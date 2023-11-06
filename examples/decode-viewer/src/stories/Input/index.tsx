/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState } from "react"

import "./index.scss"

// export type SimpleTypeCodecs =
//   | VoidDecoded["codec"]
//   | BoolDecoded["codec"]
//   | StringDecoded["codec"]
//   | NumberDecoded["codec"]
//   | BigNumberDecoded["codec"]
//   | BitSequenceDecoded["codec"]
//   | BytesSequenceDecoded["codec"]
//   | BytesArrayDecoded["codec"]
//   | AccountIdDecoded["codec"]

interface InputProps {
  codec: any
}

interface SimpleInputProps {
  label: string
  value: any
  len?: number
  style?: object
  smaller?: boolean
  disabled?: boolean
  onChange?: (e: any) => void
}

interface CommonProps {
  input: string
}

type FullProps = InputProps & SimpleInputProps & CommonProps

const ExtraInput = ({ input }: CommonProps) => {
  const [show, setShow] = useState<boolean>(false)
  return (
    input && (
      <>
        <div
          style={{
            display: show ? "block" : "none",
            margin: "0.5rem 0 0 1rem",
          }}
        >
          {input && <SimpleInput value={input} label={"Input"} smaller />}
        </div>
        <button
          className="show-button"
          style={{ fontSize: "0.7rem" }}
          onClick={() => setShow(!show)}
        >
          {show ? "Hide" : "Show"}
        </button>
      </>
    )
  )
}

export const SimpleInput = ({
  label,
  value,
  smaller,
  style,
  disabled,
  onChange,
}: SimpleInputProps) => (
  <div
    style={style}
    className={`custom-input-wrapper${smaller ? " smaller" : ""}`}
  >
    {label && <div className="label">{label}</div>}
    <input
      disabled={disabled}
      id={Math.random().toString()}
      value={value}
      onChange={onChange}
    />
  </div>
)

export const Input: FC<FullProps> = ({
  codec,
  value,
  len,
  input,
  disabled,
  path,
  label,
}: FullProps) => {
  let inputValue = value

  const group = { input, path, disabled }

  switch (codec) {
    // Here are Simple components that needs more than one input
    case "AccountId":
    case "bitSequence": {
      const entries = Object.entries(inputValue)
      return (
        <>
          <div className="multiple">
            {entries?.map((entry) => (
              <SimpleInput label={entry[0]} value={entry[1]} {...group} />
            ))}
          </div>
          {ExtraInput(group)}
        </>
      )
    }
    // Here are Simple components
    case "Bytes": {
      inputValue = value
        ? "[" + Uint8Array.from(Object.values(value)) + "]"
        : ""
      break
    }
    case "BytesArray": {
      return (
        <div className="multiple">
          <SimpleInput label={label} value={inputValue} {...group} />
          <SimpleInput label={"len"} value={len} {...group} />
          {ExtraInput(group)}
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
      inputValue = value?.toString()
      break
  }

  return (
    <>
      <SimpleInput label={label} value={inputValue} {...group} />
      {ExtraInput(group)}
    </>
  )
}
