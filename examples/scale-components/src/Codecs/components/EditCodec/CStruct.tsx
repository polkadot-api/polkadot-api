import * as Accordion from "@radix-ui/react-accordion"
import { EditStruct } from "../../lib"

export const CStruct: EditStruct = ({ innerComponents }) => (
  <div className="flex flex-col text-left">
    <ul className="ml-[20px] mb-5">
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
        </li>
      ))}
    </ul>
  </div>
)
