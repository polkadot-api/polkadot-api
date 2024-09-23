/**
 * @type {import("tailwindcss").Config}
 */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addVariant }) {
      addVariant("group-state-open", ':merge(.group)[data-state="open"] &')
    },
  ],
}
