import { PrimitiveDisplay } from "./PrimitiveDisplay"
import { ViewAccountId } from "../../lib"

export const CAccountId: ViewAccountId = ({ value }) => (
  <PrimitiveDisplay type="AccountId" value={value} />
)
