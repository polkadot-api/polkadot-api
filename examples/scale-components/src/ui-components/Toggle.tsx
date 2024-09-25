import * as Toggle from "@radix-ui/react-toggle"

const SliderToggle: React.FC<{
  isToggled: boolean
  toggle: () => void
}> = ({ isToggled, toggle }) => {
  return (
    <Toggle.Root
      pressed={isToggled}
      onPressedChange={() => toggle()}
      className={`relative w-10 h-6 rounded-full p-1 transition-colors
        ${isToggled ? "bg-green-500" : "bg-gray-400"}`}
      aria-label="Toggle"
    >
      <span
        className={`block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform
          ${isToggled ? "translate-x-4" : "translate-x-0"}`}
      />
    </Toggle.Root>
  )
}

export default SliderToggle
