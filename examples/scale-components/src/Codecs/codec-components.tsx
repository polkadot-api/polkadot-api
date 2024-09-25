import { Binary, HexString } from "@polkadot-api/substrate-bindings"
import * as Accordion from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import React, { ReactNode } from "react"
import {
  CodecComponentProps,
  PrimitiveComponentProps,
} from "./components/common"

export type VoidInterface = {}
export type BoolInterface = PrimitiveComponentProps<boolean>
export type StrInterface = PrimitiveComponentProps<string>
export type BytesInterface = PrimitiveComponentProps<Binary> & {
  len?: number
}
export type EthAccountInterface = PrimitiveComponentProps<HexString>

export const CBool: React.FC<BoolInterface> = ({ value }) => (
  <input type="checkbox" checked={value} />
)

export const CVoid: React.FC<VoidInterface> = () => null

export const CString: React.FC<StrInterface> = ({ value }) => (
  <span>{value}</span>
)

export const CBytes: React.FC<BytesInterface> = ({ value }) => {
  const textRepresentation = value.asText()
  const printableTextPattern = /^[\x20-\x7E\t\n\r]*$/

  if (printableTextPattern.test(textRepresentation)) {
    return <span>{value.asText()}</span>
  } else {
    return <span>{value.asHex()}</span>
  }
}

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
    <ul className=" mb-5">
      {Object.entries(innerComponents).map(([key, jsx]) => (
        <li key={key} className="flex flex-col">
          <Accordion.Root
            key={key}
            type="single"
            collapsible
            defaultValue={`item-${key}`}
            className=""
          >
            <Accordion.AccordionItem value={`item-${key}`}>
              <Accordion.AccordionTrigger className="font-semibold text-sm text-gray-400 flex flex-row justify-between w-full items-center group">
                {key}
                <div className="group-state-open:hidden ml-2">+</div>
                <div className="hidden group-state-open:flex ml-2">-</div>
              </Accordion.AccordionTrigger>
              <Accordion.AccordionContent>{jsx}</Accordion.AccordionContent>
            </Accordion.AccordionItem>
          </Accordion.Root>
          {/* <span className="font-semibold text-sm text-gray-400">{key}</span> */}
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
