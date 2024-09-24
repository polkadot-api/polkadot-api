import { useState, useEffect } from "react"
import { PrimitiveComponentProps } from "../codec-components"

export type NumberInterface = PrimitiveComponentProps<number> & {
  type: "u8" | "u16" | "u32" | "i8" | "i16" | "i32" | "compactNumber"
}

export const CNumber: React.FC<NumberInterface> = ({
  type,
  value,
  onValueChanged,
}) => {
  const [localInput, setLocalInput] = useState<number | null>(value)
  const [inEdit, setInEdit] = useState<boolean>(false)
  const [isValid, setIsValid] = useState<{ valid: boolean; reason?: string }>({
    valid: true,
  })

  const sign = type === "compactNumber" ? "i" : type.substring(0, 1)
  const size = type === "compactNumber" ? 32 : Number(type.substring(1))

  const maxLen = sign === "i" ? 2 ** size / 2 - 1 : 2 ** size - 1
  const minLen = sign === "i" ? -(2 ** size / 2) : 0

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (event.target.value === "") setLocalInput(null)
      else {
        const parsed = Number(event.target.value)
        if (!isNaN(parsed)) setLocalInput(Number(event.target.value))
      }
    } catch (_) {
      return
    }
  }

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
          className="bg-gray-700 border-none hover:border-none outline-none text-right max-w-32"
          value={localInput === null ? "" : localInput.toString()}
          onChange={onChange}
        />
        <input
          checked={inEdit}
          type="checkbox"
          onChange={() => {
            if (isValid.valid) onValueChanged(localInput as number)
            else setLocalInput(value)
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
