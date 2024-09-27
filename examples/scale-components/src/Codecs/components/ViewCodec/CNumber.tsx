import { PrimitiveDisplay } from "./PrimitiveDisplay"
import { ViewNumber } from "../../lib"

export const CNumber: ViewNumber = ({ numType, value, encodedValue }) => (
  <PrimitiveDisplay
    type={numType}
    value={value.toString()}
    encodedValue={encodedValue}
  />
)
