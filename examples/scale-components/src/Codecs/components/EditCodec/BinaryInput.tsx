import { Binary, HexString } from "@polkadot-api/substrate-bindings"
import { useEffect, useState } from "react"
import SliderToggle from "../../../ui-components/Toggle"
import clsx from "clsx"

export const BinaryInput: React.FC<{
  encodedValue: Uint8Array | undefined
  onBinChanged: (newValue: Uint8Array | HexString) => boolean
}> = ({ encodedValue, onBinChanged }) => {
  const [localInput, setLocalInput] = useState<HexString | undefined>("0x")
  const [isInvalid, setInvalid] = useState<boolean>(false)
  const [shouldHide, setShouldHide] = useState<boolean>(true)
  const [inEdit, setInEdit] = useState<boolean>(false)

  useEffect(() => {
    encodedValue && setLocalInput(Binary.fromBytes(encodedValue).asHex())
  }, [])

  useEffect(() => {
    encodedValue && setLocalInput(Binary.fromBytes(encodedValue).asHex())
    setInvalid(false)
  }, [encodedValue])
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        <span className="text-sm">Show binary</span>
        <SliderToggle
          isToggled={!shouldHide}
          toggle={() => {
            if (!shouldHide) setInEdit(false)
            setShouldHide((prev) => !prev)
          }}
        />
      </div>
      <div
        className={clsx(
          shouldHide && "hidden",
          "flex flex-row items-center gap-2",
        )}
      >
        <div>
          <input
            disabled={!inEdit}
            className="bg-gray-700 rounded py-1 px-2 border-none hover:border-none outline-none text-right max-w-32"
            value={localInput}
            onChange={(evt) => {
              setLocalInput(evt.target.value)
              let response = onBinChanged(evt.target.value)
              setInvalid(!response)
            }}
          />
          <span className="text-red-500">{isInvalid && "Invalid hex."}</span>
        </div>
        <div className="flex flex-row items-center text-xs gap-1">
          <SliderToggle
            isToggled={inEdit}
            toggle={() => setInEdit((prev) => !prev)}
          />
          <span>edit</span>
        </div>
      </div>
    </div>
  )
}
