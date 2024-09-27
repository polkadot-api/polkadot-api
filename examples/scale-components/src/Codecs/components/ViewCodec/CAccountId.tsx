import { PrimitiveDisplay } from "./PrimitiveDisplay"
import { ViewAccountId } from "../../lib"

export const CAccountId: ViewAccountId = ({ value, encodedValue }) => (
  <PrimitiveDisplay
    type="AccountId"
    value={value}
    encodedValue={encodedValue}
  />
)
