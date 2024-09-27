import { withDepth } from "../utils/depth"
import { clsx } from "clsx"
import { ViewEnum } from "../../lib"
import { BinaryDisplay } from "./Binary"
import { Binary } from "@polkadot-api/substrate-bindings"

export const CEnum: ViewEnum = withDepth(
  ({ value, tags, inner, shape, encodedValue }) => {
    let innerShape = shape.value[value.type]
    let innerType

    if (innerShape.type === "lookupEntry") {
      innerType = innerShape.value.type
    } else {
      innerType = innerShape.type
    }
    const shouldNest =
      innerType === "array" ||
      innerType === "sequence" ||
      innerType === "struct" ||
      innerType === "enum" ||
      innerType === "result"
    const disabled = true

    return (
      <div
        className={clsx(
          "flex text-left gap-2 ml-0 items-start",
          shouldNest
            ? "flex-col border-l-[1px] border-dashed border-gray-500"
            : "flex-row",
        )}
      >
        <div className="flex flex-row">
          <select
            disabled={false}
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
          {/* {Binary.fromBytes(encodedValue).asHex()} */}
          {/* <BinaryDisplay encodedValue={encodedValue} /> */}
        </div>
        <div className={clsx(shouldNest && "ml-[30px]")}>{inner}</div>
      </div>
    )
  },
)
