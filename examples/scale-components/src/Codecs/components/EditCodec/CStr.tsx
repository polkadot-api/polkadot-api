import { EditStr } from "../../lib"
import { withDefault } from "../utils/default"

export const CStr: EditStr = ({
  value,
  encodedValue,
  type,
  onValueChanged,
}) => {
  return (
    <div>
      <input
        className="bg-gray-700 border-none hover:border-none outline-none text-right min-w-96"
        value={withDefault(value, "")}
        onChange={(evt) => {
          onValueChanged(evt.target.value)
        }}
      />
    </div>
  )
}
