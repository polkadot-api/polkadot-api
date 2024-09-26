import { useLayoutEffect, useRef, useState } from "react"
import { ViewStruct } from "../../lib"
import * as Accordion from "@radix-ui/react-accordion"
import clsx from "clsx"

export const CStruct: ViewStruct = ({ innerComponents, shape, value }) => {
  const [maxWidth, setMaxWidth] = useState(0)
  const contentRefs = useRef<(HTMLSpanElement | null)[]>([])

  useLayoutEffect(() => {
    const widths = contentRefs.current
      .map((ref) => ref?.scrollWidth)
      .filter((el) => el !== undefined)
    setMaxWidth(Math.max(...widths))
  }, [])

  return (
    <div className="flex flex-col text-left">
      <Accordion.Root
        key={"hello"}
        type="multiple"
        defaultValue={Object.keys(innerComponents)}
        className="mb-2"
      >
        {Object.entries(innerComponents).map(([key, jsx]) => {
          const innerShape = shape.value[key].type
          const isComplex = innerShape === "struct"

          return (
            <Accordion.AccordionItem
              value={`${key}`}
              defaultValue={`${key}`}
              key={key}
              className="mb-2"
            >
              <Accordion.AccordionTrigger
                className="font-semibold text-sm text-gray-400 flex flex-row justify-between gap-2 w-full items-center group "
                style={{ width: maxWidth + 10 }}
              >
                <span ref={(el) => (contentRefs.current[0] = el)}>{key}</span>
                <div className="group-state-open:hidden ml-2">+</div>
                <div className="hidden group-state-open:flex ml-2">-</div>
              </Accordion.AccordionTrigger>
              <Accordion.AccordionContent
                className={clsx(isComplex && "ml-[20px]")}
              >
                {jsx}
              </Accordion.AccordionContent>
            </Accordion.AccordionItem>
          )
        })}
      </Accordion.Root>
    </div>
  )
}
