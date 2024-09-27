import { BinaryDisplay } from "./Binary"

export const PrimitiveDisplay: React.FC<{
  type: string
  value: string
  encodedValue?: Uint8Array
}> = ({ type, value, encodedValue }) => (
  <div className="">
    <div className="flex flex-row bg-gray-700 rounded p-2 gap-2 items-center px-2 w-fit">
      <span className="text-sm text-gray-400">{type}</span>
      <span className="bg-gray-700 border-none hover:border-none outline-none text-right min-w-[30px] w-fit">
        {value}
      </span>
    </div>
    {encodedValue && <BinaryDisplay encodedValue={encodedValue} />}
  </div>
)
