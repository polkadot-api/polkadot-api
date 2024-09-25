import { useState, useEffect } from "react"
import {
  SS58String,
  getSs58AddressInfo,
} from "@polkadot-api/substrate-bindings"
import { ViewAccountId } from "../../lib"

export const CAccountId: ViewAccountId = ({ value }) => {
  const [inEdit, setInEdit] = useState<boolean>(false)
  const [localInput, setLocalInput] = useState<SS58String>(value)
  const [isValid, setIsValid] = useState<boolean>(true)

  useEffect(() => {
    if (localInput === null) setIsValid(false)
    else {
      let { isValid } = getSs58AddressInfo(localInput)
      setIsValid(isValid)
    }
  }, [localInput])
  return (
    <div className="min-h-16">
      <div className="flex flex-row bg-gray-700 rounded p-2 gap-2 items-center px-2">
        <span className="text-sm text-gray-400">AccountId</span>
        <input
          disabled={!inEdit}
          className="bg-gray-700 border-none hover:border-none outline-none text-right min-w-96"
          value={localInput === null ? "" : localInput.toString()}
          onChange={(evt) => {
            try {
              let address = evt.target.value
              setLocalInput(address)
            } catch (_) {
              return
            }
          }}
        />
        <input
          checked={inEdit}
          type="checkbox"
          onChange={() => {
            if (!isValid) setLocalInput(value)
            setInEdit((prev) => !prev)
          }}
        />
      </div>
      {!isValid && (
        <span className="text-red-600 text-sm">Invalid address.</span>
      )}
    </div>
  )
}
