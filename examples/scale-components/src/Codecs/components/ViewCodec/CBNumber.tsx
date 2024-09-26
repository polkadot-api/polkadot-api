import { PrimitiveDisplay } from "./PrimitiveDisplay"
import { ViewBigNumber } from "../../lib"

export const CBigNumber: ViewBigNumber = ({ type, value }) => {
  return <PrimitiveDisplay type={type} value={value.toString() + "n"} />
}
