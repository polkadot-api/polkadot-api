import { withDepth } from "../utils/depth"
import { clsx } from "clsx"
import { ViewEnum } from "../../lib"

export const CEnum: ViewEnum = withDepth(({ value, tags, inner }) => {
  const shouldNest = false
  const disabled = false

  return (
    <div
      className={clsx(
        "flex text-left gap-2 w-fit ml-0 items-start",
        shouldNest
          ? "flex-col border-[1px] border-dashed border-gray-500"
          : "flex-row",
      )}
    >
      <select
        disabled={disabled}
        className={clsx(
          "w-fit bg-slate-700 p-2 rounded pr-8 border-r-4 border-slate-700",
          disabled && "appearance-none",
        )}
      >
        {tags.map(({ tag }) => (
          <option key={tag} value={tag} selected={tag === value.type}>
            {tag}
          </option>
        ))}
      </select>
      <div className={clsx(shouldNest && "ml-[30px]")}>{inner}</div>
    </div>
  )
})
