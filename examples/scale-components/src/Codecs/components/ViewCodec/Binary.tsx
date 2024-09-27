import { Binary } from "@polkadot-api/substrate-bindings"
import SliderToggle from "../../../ui-components/Toggle"
import { useState } from "react"
import clsx from "clsx"

export const BinaryDisplay: React.FC<{ encodedValue: Uint8Array }> = ({
  encodedValue,
}) => {
  const [shouldHide, setShouldHide] = useState<boolean>(true)
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2 items-center">
        <span className="text-xs">Show binary</span>
        <SliderToggle
          isToggled={!shouldHide}
          toggle={() => setShouldHide((prev) => !prev)}
        />
      </div>
      <span className={clsx(shouldHide && "hidden")}>
        {Binary.fromBytes(encodedValue).asHex()}
      </span>
    </div>
  )
}
