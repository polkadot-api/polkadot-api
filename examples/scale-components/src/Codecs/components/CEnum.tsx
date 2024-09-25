import { ReactNode, useState } from "react"
import { Var } from "@polkadot-api/metadata-builders"
import { clsx } from "clsx"
import { withDepth } from "../utils/depth"
import { CodecComponentProps } from "./common"
import SliderToggle from "../../ui-components/Toggle"

type LookupTypes = Var["type"]
type EnumInterface = CodecComponentProps<{ type: string; value: any }> & {
  tags: Array<{ idx: number; tag: string }>
  onChange: (val: string | { type: string; value: any }) => void
  inner: ReactNode
  innerType: LookupTypes
}

export const CEnum: React.FC<EnumInterface> = withDepth(
  ({ value, tags, onChange, inner, innerType }) => {
    const [inEdit, setInEdit] = useState<boolean>(false)

    const shouldNest =
      innerType === "enum" ||
      innerType === "struct" ||
      innerType === "array" ||
      innerType === "sequence"

    return (
      <div
        className={clsx(
          "flex text-left gap-2 w-fit ml-0 items-start",
          shouldNest
            ? "flex-col border-[1px] border-dashed border-gray-500"
            : "flex-row",
        )}
      >
        <div className="flex flex-row items-center">
          <select
            disabled={!inEdit}
            className={clsx(
              "w-fit bg-slate-700 p-2 rounded pr-8 border-r-4 border-slate-700",
              !inEdit && "appearance-none",
            )}
            onChange={(e) => onChange(e.target.value)}
          >
            {tags.map(({ tag }) => (
              <option key={tag} value={tag} selected={tag === value.type}>
                {tag}
              </option>
            ))}
          </select>
          <SliderToggle
            isToggled={inEdit}
            toggle={() => setInEdit((prev) => !prev)}
          />
        </div>
        <div className={clsx(shouldNest && "ml-[30px]")}>{inner}</div>
      </div>
    )
  },
)
