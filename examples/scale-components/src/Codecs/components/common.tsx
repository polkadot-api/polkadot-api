export const PrimitiveDisplay: React.FC<{
  type: string
  value: string
  encodedValue: Uint8Array
}> = ({ type, value }) => (
  <span className="flex flex-row bg-gray-700 rounded p-2 w-fit min-w-20 gap-2 justify-between items-center px-2">
    <span className="text-sm text-gray-400">{type}</span>
    <span>{value}</span>
  </span>
)
