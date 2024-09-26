import { Binary, HexString } from "@polkadot-api/substrate-bindings"
import { useEffect, useState } from "react"

export const BinaryInput: React.FC<{
  encodedValue: Uint8Array | undefined
  onBinChanged: (newValue: Uint8Array | HexString) => boolean
}> = ({ encodedValue, onBinChanged }) => {
  const [localInput, setLocalInput] = useState<HexString | undefined>("0x")
  const [isInvalid, setInvalid] = useState<boolean>(false)

  useEffect(() => {
    encodedValue && setLocalInput(Binary.fromBytes(encodedValue).asHex())
  }, [])

  useEffect(() => {
    encodedValue && setLocalInput(Binary.fromBytes(encodedValue).asHex())
    setInvalid(false)
  }, [encodedValue])
  return (
    <div>
      <input
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
  )
}
