import { Binary, HexString, SS58String } from "@polkadot-api/substrate-bindings"
import * as Accordion from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import React, { ReactNode, useState } from "react"
import { InputWrapper, PrimitiveDisplay } from "./components/common"

export type CodecComponentProps<T = any> = {
  value: T
  encodedValue: Uint8Array
}

export type PrimitiveComponentProps<T = any> = CodecComponentProps<T> & {
  onValueChanged: (newValue: T) => void
  onBinChanged: (newValue: Uint8Array | HexString) => void
}

export type VoidInterface = {}
export type NumberInterface = PrimitiveComponentProps<number> & {
  type: "u8" | "u16" | "u32" | "i8" | "i16" | "i32" | "compactNumber"
}
export type BNumberInterface = PrimitiveComponentProps<bigint> & {
  type: "u64" | "u128" | "u256" | "i64" | "i128" | "i256" | "compactBn"
}
export type BoolInterface = PrimitiveComponentProps<boolean>
export type StrInterface = PrimitiveComponentProps<string>
export type BytesInterface = PrimitiveComponentProps<Binary> & {
  len?: number
}
export type AccountIdInterface = PrimitiveComponentProps<SS58String>
export type EthAccountInterface = PrimitiveComponentProps<HexString>

export const CNumber: React.FC<NumberInterface> = ({
  type,
  value,
  encodedValue,
}) => {
  const [localInput, setLocalInput] = useState<number | null>(value)
  const [inEdit, setInEdit] = useState<boolean>(false)
  return (
    <span className="flex flex-row bg-gray-700 rounded p-2 gap-2 items-center px-2 w-fit">
      <span className="text-sm text-gray-400">{type}</span>
      <input
        disabled={!inEdit}
        className="bg-gray-700 border-none hover:border-none outline-none text-right max-w-32"
        value={localInput === null ? "" : localInput.toString()}
        onChange={(evt) => {
          try {
            if (evt.target.value === "") setLocalInput(null)
            else {
              const parsed = Number(evt.target.value)
              if (!isNaN(parsed)) setLocalInput(Number(evt.target.value))
            }
          } catch (_) {
            return
          }
        }}
      />
      <input
        checked={inEdit}
        type="checkbox"
        onChange={() => {
          setInEdit((prev) => !prev)
        }}
      />
    </span>
  )
}
export const CBNumber: React.FC<BNumberInterface> = ({
  type,
  value,
  encodedValue,
  onValueChanged,
}) => {
  const [localInput, setLocalInput] = useState<bigint | null>(value)
  const [inEdit, setInEdit] = useState<boolean>(false)
  return (
    <span className="flex flex-row bg-gray-700 rounded p-2 gap-2 items-center px-2 w-fit">
      <span className="text-sm text-gray-400">{type}</span>
      <input
        disabled={!inEdit}
        className="bg-gray-700 border-none hover:border-none outline-none text-right max-w-32 w-fit"
        value={localInput === null ? "" : localInput.toString()}
        onChange={(evt) => {
          try {
            if (evt.target.value === "") setLocalInput(null)
            else {
              let num = BigInt(evt.target.value)
              setLocalInput(num)
              onValueChanged(num)
            }
          } catch (_) {
            return
          }
        }}
      />
      <span className="-ml-1">n</span>
      <input
        checked={inEdit}
        type="checkbox"
        onChange={() => {
          setInEdit((prev) => !prev)
        }}
      />
    </span>
  )
}

export const CBool: React.FC<BoolInterface> = ({ value }) => (
  <input type="checkbox" checked={value} />
)

export const CVoid: React.FC<VoidInterface> = () => null

export const CString: React.FC<StrInterface> = ({ value }) => (
  <span>{value}</span>
)

export const CBytes: React.FC<BytesInterface> = ({ value }) => {
  return <span>{value.asText()}</span>
}

export const CAccountId: React.FC<AccountIdInterface> = ({
  value,
  encodedValue,
}) => (
  <PrimitiveDisplay
    type="AccountId"
    value={value.toString()}
    encodedValue={encodedValue}
  />
)

export const CEthAccount: React.FC<EthAccountInterface> = ({ value }) => (
  <span>{value}</span>
)

export type SequenceInterface<T = any> = CodecComponentProps<Array<T>> & {
  innerComponents: Array<React.ReactNode>
  onAddItem: (idx?: number, value?: T) => void
  onDeleteItem: (idx: number) => void
  onReorder: (prevIdx: number, newIdx: number) => void
}

export const CSequence: React.FC<SequenceInterface> = ({
  encodedValue,
  innerComponents,
}) => {
  return <ListDisplay innerComponents={innerComponents} />
}

export type ArrayInterface<T = any> = CodecComponentProps<Array<T>> & {
  innerComponents: Array<React.ReactNode>
  onReorder: (prevIdx: number, newIdx: number) => void
}
export const CArray: React.FC<ArrayInterface> = ({
  encodedValue,
  innerComponents,
}) => {
  return <ListDisplay innerComponents={innerComponents} />
}

const ListDisplay: React.FC<{ innerComponents: ReactNode[] }> = ({
  innerComponents,
}) => {
  return (
    <ul>
      {innerComponents.map((component, idx) => {
        return (
          <Accordion.Root
            key={idx}
            type="single"
            collapsible
            defaultValue="item-0"
            className="bg-gray-800 rounded my-2 p-2"
          >
            <Accordion.AccordionItem value={`item-${idx}`}>
              <Accordion.AccordionTrigger className="flex flex-row justify-between w-full items-center group">
                ITEM {idx + 1}{" "}
                <ChevronDownIcon className="group-state-open:rotate-180 transition-all" />
              </Accordion.AccordionTrigger>
              <Accordion.AccordionContent>
                {component}
              </Accordion.AccordionContent>
            </Accordion.AccordionItem>
          </Accordion.Root>
        )
      })}
    </ul>
  )
}

export type TupleInterface<T = any> = CodecComponentProps<Array<T>> & {
  innerComponents: Array<React.ReactNode>
}
export const CTuple: React.FC<TupleInterface> = ({ innerComponents }) => {
  return (
    <ul>
      Tuple [
      {innerComponents.map((jsx) => (
        <li>{jsx},</li>
      ))}
      ]
    </ul>
  )
}

export type StructInterface = CodecComponentProps<Record<string, any>> & {
  innerComponents: Record<string, React.ReactNode>
}
export const CStruct: React.FC<StructInterface> = ({ innerComponents }) => (
  <div className="flex flex-col text-left">
    <ul className="ml-[20px]">
      {Object.entries(innerComponents).map(([key, jsx]) => (
        <li key={key} className="flex flex-col mb-2">
          <span className="font-semibold text-sm mb-2 text-gray-400">
            {key}
          </span>
          {jsx}
        </li>
      ))}
    </ul>
  </div>
)

type OptionInterface<T = any> = CodecComponentProps<T | undefined> & {
  onChange: (value: boolean | { set: true; value: T }) => void
  inner: ReactNode
}
export const COption: React.FC<OptionInterface> = ({ value, inner }) =>
  value === undefined ? "null" : inner

type ResultInterface = CodecComponentProps<{ success: boolean; value: any }> & {
  onChange: (value: boolean | { success: boolean; value: any }) => void
  inner: ReactNode
}

export const CResult: React.FC<ResultInterface> = ({ value, inner }) => (
  <>
    {value.success ? "ok" : "ko"}-{inner}
  </>
)
