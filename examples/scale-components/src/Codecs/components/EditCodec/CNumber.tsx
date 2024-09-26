import { useState, useEffect } from "react"
import SliderToggle from "../../../ui-components/Toggle"
import { EditNumber, NOTIN } from "../../lib"

export const CNumber: EditNumber = ({ type, value, numType }) => {
  if (type === "blank") {
    return
  }
  const [localInput, setLocalInput] = useState<number | NOTIN>(value)
  const [inEdit, setInEdit] = useState<boolean>(false)
  const [isValid, setIsValid] = useState<{ valid: boolean; reason?: string }>({
    valid: true,
  })

  const sign = numType === "compactNumber" ? "i" : numType.substring(0, 1)
  const size = numType === "compactNumber" ? 32 : Number(numType.substring(1))

  const maxLen = sign === "i" ? 2 ** size / 2 - 1 : 2 ** size - 1
  const minLen = sign === "i" ? -(2 ** size / 2) : 0

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (event.target.value === "") setLocalInput(NOTIN)
      else {
        const parsed = Number(event.target.value)
        if (!isNaN(parsed)) setLocalInput(Number(event.target.value))
      }
    } catch (_) {
      return
    }
  }

  useEffect(() => {
    if (localInput === NOTIN)
      setIsValid({ valid: false, reason: "Please enter a value" })
    else if (localInput > maxLen)
      setIsValid({ valid: false, reason: "Too high. Max is " + maxLen })
    else if (localInput < minLen)
      setIsValid({ valid: false, reason: "Too low. Min is " + minLen })
    else setIsValid({ valid: true })
  }, [localInput, numType])

  return (
    <div className="min-h-16">
      <div className="flex flex-row bg-gray-700 rounded p-2 gap-2 items-center px-2 w-fit">
        <span className="text-sm text-gray-400">{numType}</span>
        <input
          disabled={!inEdit}
          className="bg-gray-700 border-none hover:border-none outline-none text-right max-w-32"
          value={localInput === null ? "" : localInput.toString()}
          onChange={onChange}
        />
        <SliderToggle
          isToggled={inEdit}
          toggle={() => {
            // if (isValid.valid) onValueChanged(localInput as number)
            // else setLocalInput(value)
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
