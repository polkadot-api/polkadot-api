import { EditTuple } from "../../lib"

export const CTuple: EditTuple = ({ innerComponents }) => {
  return (
    <ul className="flex flex-col ml-5">
      {innerComponents.map((jsx) => (
        <li>{jsx}</li>
      ))}
    </ul>
  )
}
