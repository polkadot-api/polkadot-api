import { useState, useEffect } from "react"
import {
  SS58String,
  getSs58AddressInfo,
} from "@polkadot-api/substrate-bindings"
import { EditAccountId } from "../../lib"
import { withDefault } from "../utils/default"

enum ErrorReason {
  INITIALIZATION = "",
  EMPTY = "Please enter a value",
  INVALID_ADDRESS = "Invalid address",
}

export const CAccountId: EditAccountId = ({ value, onValueChanged }) => {
  const [localInput, setLocalInput] = useState<SS58String>(
    withDefault(value, ""),
  )
  const [validation, setValidation] = useState<{
    isValid: boolean
    reason?: ErrorReason
  }>({ isValid: false, reason: ErrorReason.INITIALIZATION })

  useEffect(() => {
    if (localInput === "")
      setValidation({ isValid: false, reason: ErrorReason.EMPTY })
    else {
      let { isValid } = getSs58AddressInfo(localInput)
      isValid
        ? setValidation({ isValid: true })
        : setValidation({ isValid: false, reason: ErrorReason.INVALID_ADDRESS })
    }
  }, [localInput])

  return (
    <div className="min-h-16">
      <div className="flex flex-row bg-gray-700 rounded p-2 gap-2 items-center px-2">
        <span className="text-sm text-gray-400">AccountId</span>
        <input
          className="bg-gray-700 border-none hover:border-none outline-none text-right min-w-96"
          value={localInput}
          onChange={(evt) => {
            try {
              let address = evt.target.value
              setLocalInput(address)
              if (address === "") {
                setValidation({ isValid: false, reason: ErrorReason.EMPTY })
              } else {
                let { isValid } = getSs58AddressInfo(address)
                if (isValid) {
                  setValidation({ isValid: true })
                  onValueChanged(address)
                } else {
                  setValidation({
                    isValid: false,
                    reason: ErrorReason.INVALID_ADDRESS,
                  })
                }
              }
            } catch (_) {
              return
            }
          }}
        />
      </div>
      {!validation.isValid && (
        <span className="text-red-600 text-sm">{validation.reason}</span>
      )}
    </div>
  )
}
