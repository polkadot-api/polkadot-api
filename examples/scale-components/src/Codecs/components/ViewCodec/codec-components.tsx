import * as Accordion from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import React, { ReactNode } from "react"
import {
  ViewArray,
  ViewBool,
  ViewEthAccount,
  ViewOption,
  ViewResult,
  ViewSequence,
  ViewStr,
  ViewTuple,
  ViewVoid,
} from "../../lib"
import { withDefault } from "../utils/default"

export const CBool: ViewBool = ({ value }) => (
  <input type="checkbox" checked={withDefault(value, false)} />
)

export const CVoid: ViewVoid = () => null

export const CStr: ViewStr = ({ value }) => (
  <span>{withDefault(value, "")}</span>
)

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
            className="my-2 p-2"
          >
            <Accordion.AccordionItem value={`item-${idx}`}>
              <Accordion.AccordionTrigger className="flex flex-row w-full items-center gap-2 group mb-2">
                ITEM {idx + 1}
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

export const COption: ViewOption = ({ value, inner }) =>
  value === undefined ? "null" : inner

export const CResult: ViewResult = ({ value, inner }) => (
  <>
    {value.success ? "ok" : "ko"}-{inner}
  </>
)
