import { PrimitiveDisplay } from "./PrimitiveDisplay"
import { ViewBigNumber } from "../../lib"

export const CBigNumber: ViewBigNumber = ({ numType, value, encodedValue }) => {
  return (
    <PrimitiveDisplay
      type={numType}
      value={value.toString()}
      encodedValue={encodedValue}
    />
  )
}
