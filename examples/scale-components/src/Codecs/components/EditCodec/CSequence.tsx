import { EditSequence, NOTIN } from "../../lib"

export const CSequence: EditSequence = ({
  innerComponents,
  value,
  onValueChanged,
}) => {
  const addItem = () => {
    const curr = value !== NOTIN ? value.slice() : []

    curr.push(NOTIN)
    onValueChanged([...curr])
  }

  const removeItem = (idx: number) => {
    const curr = value !== NOTIN ? value.slice() : []
    curr.splice(idx, 1)
    onValueChanged([...curr])
  }

  return (
    <div className="text-gray-50">
      {innerComponents.map((item, idx) => (
        <div
          key={idx}
          className="flex flex-col border-[1px] border-dashed my-1"
        >
          <div className="flex flex-row gap-2 items-center">
            <span>Item {idx + 1}</span>
            <button
              className="border-[1px] rounded p-1 text-red-600"
              onClick={() => removeItem(idx)}
            >
              delete
            </button>
          </div>
          {item}
        </div>
      ))}
      <button className="border-[1px] rounded p-1" onClick={addItem}>
        + Add new item
      </button>
    </div>
  )
}
