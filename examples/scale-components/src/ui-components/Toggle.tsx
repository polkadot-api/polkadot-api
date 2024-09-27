import * as Toggle from "@radix-ui/react-toggle"

const SliderToggle: React.FC<{
  isToggled: boolean
  toggle: () => void
}> = ({ isToggled, toggle }) => {
  return (
    <Toggle.Root
      pressed={isToggled}
      onPressedChange={() => toggle()}
      className={`relative w-8 h-5 rounded-full p-1 transition-colors
        ${isToggled ? "bg-green-500" : "bg-gray-400"}`}
      aria-label="Toggle"
    >
      <span
        className={`block w-3 h-3 bg-white rounded-full shadow-md transform transition-transform
          ${isToggled ? "translate-x-3" : "translate-x-0"}`}
      />
    </Toggle.Root>
  )
}

export default SliderToggle
