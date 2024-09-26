import { PrimitiveDisplay } from "./PrimitiveDisplay"
import { ViewNumber } from "../../lib"

export const CNumber: ViewNumber = ({ numType, value }) => (
  <PrimitiveDisplay type={numType} value={value.toString()} />
)
