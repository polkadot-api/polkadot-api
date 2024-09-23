import { withDepth } from "../utils/depth"
import { Var } from "@polkadot-api/metadata-builders"
import { CodecComponentProps } from "../codec-components"
import { ReactNode } from "react"
import { clsx } from "clsx"

type LookupTypes = Var["type"]
type EnumInterface = CodecComponentProps<{ type: string; value: any }> & {
  tags: Array<{ idx: number; tag: string }>
  onChange: (val: string | { type: string; value: any }) => void
  inner: ReactNode
  innerType: LookupTypes
}

export const CEnum: React.FC<EnumInterface> = withDepth(
  ({ encodedValue, value, tags, onChange, inner, innerType }) => {
    const shouldNest =
      innerType === "enum" ||
      innerType === "struct" ||
      innerType === "array" ||
      innerType === "sequence"
    const disabled = false

    return (
      <div
        className={clsx(
          "flex",
          shouldNest
            ? "flex-col border-[1px] border-dashed border-gray-500 w-full"
            : "flex-row items-center",
          "text-left gap-2 w-fit ml-0",
        )}
      >
        <select
          disabled={disabled}
          className={clsx(
            "w-fit bg-slate-700 p-2 rounded pr-8 border-r-4 border-slate-700",
            disabled && "appearance-none",
          )}
          onChange={(e) => onChange(e.target.value)}
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
  },
)
