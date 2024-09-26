import { Binary } from "@polkadot-api/substrate-bindings"
import { EditBytes } from "../../lib"
import { withDefault } from "../utils/default"

export const CBytes: EditBytes = ({ value: rawValue, onValueChanged }) => {
  const value = withDefault(rawValue, Binary.fromHex("0x"))
  const textRepresentation = value.asText()
  const printableTextPattern = /^[\x20-\x7E\t\n\r]*$/

  const representation = printableTextPattern.test(textRepresentation)
    ? value.asText()
    : value.asHex()

  return (
    <input
      className="bg-gray-700 border-none rounded py-1 px-2 hover:border-none outline-none text-left"
      value={representation}
      placeholder="Enter hex or text"
      onChange={(evt) => {
        const str = evt.target.value
        if (str.slice(0, 2) === "0x") {
          onValueChanged(Binary.fromHex(evt.target.value))
        } else {
          onValueChanged(Binary.fromText(evt.target.value))
        }
      }}
    />
  )
}
