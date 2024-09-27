import { clsx } from "clsx"
import { EditEnum } from "../../lib"
import { NOTIN } from "../../lib"
import { Binary } from "@polkadot-api/substrate-bindings"
import { useEffect } from "react"

type Tag = {
  idx: number
  tag: string
}
export const CEnum: EditEnum = ({
  type,
  value,
  encodedValue,
  tags,
  inner,
  shape,
  onValueChanged,
  onBinChanged,
}) => {
  let shouldNest = false
  if (type !== "blank") {
    let innerShape = shape.value[value.type]
    let innerType

    if (innerShape.type === "lookupEntry") {
      innerType = innerShape.value.type
    } else {
      innerType = innerShape.type
    }
    shouldNest =
      innerType === "array" ||
      innerType === "sequence" ||
      innerType === "struct" ||
      innerType === "enum" ||
      innerType === "result"
  }

  const disabled = false

  useEffect(() => {
    if (tags.length > 0 && type === "blank") {
      onValueChanged({ type: tags[0].tag, value: NOTIN })
    }
  }, [tags])
  return (
    <div
      className={clsx(
        "flex text-left gap-2 w-fit ml-0 items-start",
        shouldNest
          ? "flex-col border-[1px] border-dashed border-gray-500"
          : "flex-row",
      )}
    >
      <div>
        <SelectType
          disabled={disabled}
          onValueChanged={onValueChanged}
          tags={tags}
          value={value}
        />

        <span className="text-slate-200">
          {shouldNest && encodedValue && Binary.fromBytes(encodedValue).asHex()}
        </span>
      </div>
      <div className={clsx(shouldNest && "ml-[30px]")}>{inner}</div>
      <span className="text-slate-200">
        {!shouldNest && encodedValue && Binary.fromBytes(encodedValue).asHex()}
      </span>
    </div>
  )
}

const SelectType: React.FC<{
  tags: Tag[]
  value: { type: string; value: any } | NOTIN
  onValueChanged: ({ type, value }: { type: string; value: NOTIN }) => void
  disabled: boolean
}> = ({ disabled, value, onValueChanged, tags }) => {
  return (
    <select
      disabled={disabled}
      className={clsx(
        "w-fit bg-slate-700 p-2 rounded pr-8 border-r-4 border-slate-700",
        disabled && "appearance-none",
      )}
      onChange={(e) => onValueChanged({ type: e.target.value, value: NOTIN })}
      defaultValue={""}
    >
      {tags.map(({ tag }) => (
        <option
          key={tag}
          value={tag}
          selected={value !== NOTIN && tag === value.type}
        >
          {tag}
        </option>
      ))}
    </select>
  )
}
