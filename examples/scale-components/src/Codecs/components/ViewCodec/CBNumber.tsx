import { useState, useEffect } from "react"
import { ViewBigNumber } from "../../lib"

export const CBigNumber: ViewBigNumber = ({ type, value }) => {
  const [localInput, setLocalInput] = useState<bigint | null>(value)
  const [inEdit, setInEdit] = useState<boolean>(false)
  const [isValid, setIsValid] = useState<{ valid: boolean; reason?: string }>({
    valid: true,
  })

  const sign = type === "compactBn" ? "i" : type.substring(0, 1)
  const size = type === "compactBn" ? 64 : Number(type.substring(1))

  const maxLen = sign === "i" ? 2 ** size / 2 - 1 : 2 ** size - 1
  const minLen = sign === "i" ? -(2 ** size / 2) : 0

  useEffect(() => {
    if (localInput === null)
      setIsValid({ valid: false, reason: "Please enter a value" })
    else if (localInput > maxLen)
      setIsValid({ valid: false, reason: "Too high. Max is " + maxLen })
    else if (localInput < minLen)
      setIsValid({ valid: false, reason: "Too low. Min is " + minLen })
    else setIsValid({ valid: true })
  }, [localInput, type])

  return (
    <div className="min-h-16">
      <div className="flex flex-row bg-gray-700 rounded p-2 gap-2 items-center px-2 w-fit">
        <span className="text-sm text-gray-400">{type}</span>
        <input
          disabled={!inEdit}
          className="bg-gray-700 border-none hover:border-none outline-none text-right max-w-32 w-fit"
          value={localInput === null ? "" : localInput.toString()}
          onChange={(evt) => {
            try {
              if (evt.target.value === "") setLocalInput(null)
              else {
                let num = BigInt(evt.target.value)
                setLocalInput(num)
                // onValueChanged(num)
              }
            } catch (_) {
              return
            }
          }}
        />
        <span className="-ml-1">n</span>
        <input
          checked={inEdit}
          type="checkbox"
          onChange={() => {
            /*
            if (isValid.valid) onValueChanged(localInput as bigint)
            else setLocalInput(value)
            */
            setInEdit((prev) => !prev)
          }}
        />
      </div>
      {!isValid.valid && (
        <span className="text-red-600 text-sm">{isValid.reason}</span>
      )}
    </div>
  )
}
