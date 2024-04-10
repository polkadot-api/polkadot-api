import { createContext, useContext } from "react"

export const TokenProvider = createContext<{
  symbol: string
  decimals: number
}>({ symbol: "DOT", decimals: 10 })

export const useToken = () => useContext(TokenProvider)
