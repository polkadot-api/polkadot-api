import { Binary } from "@polkadot-api/substrate-bindings"
import * as Accordion from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import React, { ReactNode } from "react"
import {
  NOTIN,
  ViewArray,
  ViewBool,
  ViewBytes,
  ViewEthAccount,
  ViewOption,
  ViewResult,
  ViewSequence,
  ViewStr,
  ViewStruct,
  ViewTuple,
  ViewVoid,
} from "../../lib"

const withDefault: <T>(value: T | NOTIN, fallback: T) => T = (
  value,
  fallback,
) => (value === NOTIN ? fallback : value)

export const CBool: ViewBool = ({ value }) => (
  <input type="checkbox" checked={withDefault(value, false)} />
)

export const CVoid: ViewVoid = () => null

export const CStr: ViewStr = ({ value }) => (
  <span>{withDefault(value, "")}</span>
)

export const CBytes: ViewBytes = ({ value: rawValue }) => {
  const value = withDefault(rawValue, Binary.fromHex("0x"))
  const textRepresentation = value.asText()
  const printableTextPattern = /^[\x20-\x7E\t\n\r]*$/

  if (printableTextPattern.test(textRepresentation)) {
    return <span>{value.asText()}</span>
  } else {
    return <span>{value.asHex()}</span>
  }
}

export const CEthAccount: ViewEthAccount = ({ value }) => <span>{value}</span>

export const CSequence: ViewSequence = ({ innerComponents }) => {
  return <ListDisplay innerComponents={innerComponents} />
}

export const CArray: ViewArray = ({ innerComponents }) => {
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

export const CTuple: ViewTuple = ({ innerComponents }) => {
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

export const CStruct: ViewStruct = ({ innerComponents }) => (
  <div className="flex flex-col text-left">
    <ul className="ml-[20px] mb-5">
      {Object.entries(innerComponents).map(([key, jsx]) => (
        <li key={key} className="flex flex-col">
          <span className="font-semibold text-sm text-gray-400">{key}</span>
          {jsx}
        </li>
      ))}
    </ul>
  </div>
)

export const COption: ViewOption = ({ value, inner }) =>
  value === undefined ? "null" : inner

export const CResult: ViewResult = ({ value, inner }) => (
  <>
    {value.success ? "ok" : "ko"}-{inner}
  </>
)
