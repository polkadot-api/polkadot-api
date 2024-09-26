import { PrimitiveDisplay } from "./PrimitiveDisplay"
import { ViewNumber } from "../../lib"

export const CNumber: ViewNumber = ({ type, value }) => (
  <PrimitiveDisplay type={type} value={value.toString()} />
)
