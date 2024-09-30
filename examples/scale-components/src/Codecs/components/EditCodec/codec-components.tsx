import * as Accordion from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import React, { ReactNode } from "react"
import {
  EditArray,
  EditBool,
  EditEthAccount,
  EditOption,
  EditVoid,
  EditResult,
} from "../../lib"
import { withDefault } from "../utils/default"

export const CBool: EditBool = ({ value }) => (
  <input type="checkbox" checked={withDefault(value, false)} />
)

export const CVoid: EditVoid = () => null

export const CEthAccount: EditEthAccount = ({ value }) => (
  <span>{withDefault(value, "")}</span>
)

export const CArray: EditArray = ({ innerComponents }) => {
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

export const COption: EditOption = ({ value, inner }) =>
  value === undefined ? "null" : inner

export const CResult: EditResult = ({ value, inner, type }) => {
  return type === "blank" ? null : (
    <>
      {value.success ? "ok" : "ko"}-{inner}
    </>
  )
}
