import { Binary } from "@polkadot-api/substrate-bindings"
import { ViewBytes } from "../../lib"
import { withDefault } from "../utils/default"

export const CBytes: ViewBytes = ({ value: rawValue }) => {
  const value = withDefault(rawValue, Binary.fromHex("0x"))
  const textRepresentation = value.asText()
  const printableTextPattern = /^[\x20-\x7E\t\n\r]*$/

  if (printableTextPattern.test(textRepresentation)) {
    return <span>{value.asText()}</span>
  } else {
    return <span>{value.asHex()}</span>
  }
}
