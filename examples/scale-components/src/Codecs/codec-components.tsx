import { toHex } from "@polkadot-api/utils"
import { HexString, SS58String } from "@polkadot-api/substrate-bindings"
import React, { createContext, ReactNode, useContext } from "react"
import clsx from "clsx"
import * as Accordion from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "@radix-ui/react-icons"

export type CodecComponentProps<T = any> = {
  value: T
  encodedValue: Uint8Array
}

export type PrimiveComponentProps<T = any> = CodecComponentProps<T> & {
  onValueChanged: (newValue: T) => void
  onBinChanged: (newValue: Uint8Array | HexString) => void
}

export type VoidInterface = {}
export type NumberInterface = PrimiveComponentProps<number> & {
  type: "u8" | "u16" | "u32" | "i8" | "i16" | "i32" | "compactNumber"
}
export type BNumberInterface = PrimiveComponentProps<bigint> & {
  type: "u64" | "u128" | "u256" | "i64" | "i128" | "i256" | "compactBn"
}
export type BoolInterface = PrimiveComponentProps<boolean>
export type StrInterface = PrimiveComponentProps<string>
export type BytesInterface = PrimiveComponentProps<Uint8Array> & {
  len?: number
}
export type AccountIdInterface = PrimiveComponentProps<SS58String>
export type EthAccountInterface = PrimiveComponentProps<HexString>

const DepthCtx = createContext<number>(0)
const useCurrentDepth = () => useContext(DepthCtx)
const withDepth: <T extends {}>(
  base: React.FC<T & { depth: number }>,
) => React.FC<T> = (Base) => (props) => {
  const depth = useCurrentDepth()
  return (
    <DepthCtx.Provider value={depth + 1}>
      <Base {...{ depth, ...props }} />
    </DepthCtx.Provider>
  )
}

const enhancer = withDepth

export const CNumber: React.FC<NumberInterface> = ({
  type,
  value,
  encodedValue,
}) => (
  <PrimitiveDisplay
    type={type.toString()}
    value={value.toString()}
    encodedValue={encodedValue}
  />
)

export const CBNumber: React.FC<BNumberInterface> = ({
  type,
  value,
  encodedValue,
}) => (
  <PrimitiveDisplay
    type={type.toString()}
    value={`${value.toString(10)}n`}
    encodedValue={encodedValue}
  />
)
export const CBool: React.FC<BoolInterface> = ({ value }) => (
  <input type="checkbox" checked={value} />
)

export const CVoid: React.FC<VoidInterface> = () => null

export const CString: React.FC<StrInterface> = ({ value }) => (
  <span>{value}</span>
)

export const CBytes: React.FC<BytesInterface> = ({ value }) => (
  <span>{toHex(value)}</span>
)

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
  return (
    <>
      <ul>
        {innerComponents.map((component, idx) => {
          return (
            <Accordion.Root
              key={idx}
              type="single"
              collapsible
              className="bg-gray-800 rounded my-2 p-2"
            >
              <Accordion.AccordionItem value={`item-${idx}`}>
                <Accordion.AccordionTrigger className="flex flex-row justify-between w-full items-center">
                  ITEM {idx + 1} <ChevronDownIcon />
                </Accordion.AccordionTrigger>
                <Accordion.AccordionContent>
                  {component}
                </Accordion.AccordionContent>
              </Accordion.AccordionItem>
            </Accordion.Root>
          )
        })}
      </ul>
      <EncodedDisplay encodedValue={encodedValue} />
    </>
  )
}

export type ArrayInterface<T = any> = CodecComponentProps<Array<T>> & {
  innerComponents: Array<React.ReactNode>
  onReorder: (prevIdx: number, newIdx: number) => void
}
export const CArray: React.FC<ArrayInterface> = ({
  encodedValue,
  innerComponents,
}) => {
  return (
    <>
      <ul>
        {innerComponents.map((component, idx) => {
          return (
            <Accordion.Root
              key={idx}
              type="single"
              collapsible
              className="bg-gray-800 rounded my-2 p-2"
            >
              <Accordion.AccordionItem value={`item-${idx}`}>
                <Accordion.AccordionTrigger className="flex flex-row justify-between w-full items-center">
                  ITEM {idx + 1} <ChevronDownIcon />
                </Accordion.AccordionTrigger>
                <Accordion.AccordionContent>
                  {component}
                </Accordion.AccordionContent>
              </Accordion.AccordionItem>
            </Accordion.Root>
          )
        })}
      </ul>
      <EncodedDisplay encodedValue={encodedValue} />
    </>
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
export const CStruct: React.FC<StructInterface> = withDepth(
  ({ innerComponents, depth }) => (
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
  ),
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

type EnumInterface = CodecComponentProps<{ type: string; value: any }> & {
  tags: Array<{ idx: number; tag: string }>
  onChange: (val: string | { type: string; value: any }) => void
  inner: ReactNode
}

export const CEnum: React.FC<EnumInterface> = withDepth(
  ({ encodedValue, value, tags, onChange, inner, depth }) => {
    return (
      <div className={clsx("flex flex-col text-left gap-2 w-fit")}>
        <div className="flex flex-row gap-5 items-center">
          <select
            className="w-fit bg-slate-700 p-2 rounded"
            onChange={(e) => onChange(e.target.value)}
          >
            {tags.map(({ tag }) => (
              <option key={tag} value={tag} selected={tag === value.type}>
                {tag}
              </option>
            ))}
          </select>
          <EncodedDisplay encodedValue={encodedValue} />
        </div>
        <div style={{ marginLeft: "30px" }}>{inner}</div>
      </div>
    )
  },
)

const PrimitiveDisplay: React.FC<{
  type: string
  value: string
  encodedValue: Uint8Array
}> = ({ type, value, encodedValue }) => (
  <div className="flex flex-row gap-5 items-center">
    <span className="flex flex-row bg-gray-900 rounded p-2 w-fit min-w-20 gap-2 justify-between items-center px-2">
      <span className="text-sm text-gray-500">{type}</span>
      <span>{value}</span>
    </span>
    <EncodedDisplay encodedValue={encodedValue} />
  </div>
)

const EncodedDisplay: React.FC<{ encodedValue: Uint8Array }> = ({
  encodedValue,
}) => <span className="text-gray-500">{toHex(encodedValue)}</span>
