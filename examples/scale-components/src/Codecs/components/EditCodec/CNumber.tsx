import { useState } from "react"
import { EditNumber, NOTIN } from "../../lib"
import { BinaryInput } from "./BinaryInput"
export const CNumber: EditNumber = ({
  value,
  numType,
  encodedValue,
  onValueChanged,
  onBinChanged,
}) => {
  const [isValid, setIsValid] = useState<{ valid: boolean; reason?: string }>({
    valid: true,
  })

  const sign = numType === "compactNumber" ? "i" : numType.substring(0, 1)
  const size = numType === "compactNumber" ? 32 : Number(numType.substring(1))

  const maxLen = sign === "i" ? 2 ** size / 2 - 1 : 2 ** size - 1
  const minLen = sign === "i" ? -(2 ** size / 2) : 0

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const parsed = Number(event.target.value)
      if (!isNaN(parsed)) {
        if (parsed === null)
          setIsValid({ valid: false, reason: "Please enter a value" })
        else if (parsed > maxLen)
          setIsValid({ valid: false, reason: "Too high. Max is " + maxLen })
        else if (parsed < minLen)
          setIsValid({ valid: false, reason: "Too low. Min is " + minLen })
        else setIsValid({ valid: true })

        onValueChanged(parsed as number)
      }
    } catch (_) {
      return
    }
  }

  return (
    <div className="min-h-16">
      <div className="mb-2 ">
        <div className="flex flex-row bg-gray-700 rounded p-2 gap-2 items-center px-2 w-fit">
          <span className="text-sm text-gray-400">{numType}</span>
          <input
            className="bg-gray-700 border-none hover:border-none outline-none text-right max-w-32"
            value={value === NOTIN ? "" : value.toString()}
            onChange={onChange}
          />
        </div>
        {!isValid.valid && (
          <span className="text-red-600 text-sm">{isValid.reason}</span>
        )}
      </div>
      <BinaryInput encodedValue={encodedValue} onBinChanged={onBinChanged} />
    </div>
  )
}
