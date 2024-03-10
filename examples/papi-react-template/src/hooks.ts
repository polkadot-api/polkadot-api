import { SS58String, createClient } from "@polkadot-api/client"
import { getInjectedExtensions } from "@polkadot-api/legacy-polkadot-provider"
import { createContext, useContext, useEffect, useState } from "react"
import { paraChainApi, relayChainApi } from "./api"

export const useAvailableExtensions = () => {
  const [extensions, setExtensions] = useState<string[]>([])

  useEffect(() => {
    const pullExtensions = () => {
      getInjectedExtensions().then(setExtensions)
    }

    const token = setInterval(pullExtensions, 1_000)
    return () => {
      clearInterval(token)
    }
  }, [])

  return extensions
}

export const SelectedAccountCtx = createContext<SS58String | null>(null)
export const useSelectedAccount = () => useContext(SelectedAccountCtx)!

export const chainCtx = createContext<{
  chain: ReturnType<typeof createClient>
  api: typeof paraChainApi | typeof relayChainApi
} | null>(null)
export const useChain = () => useContext(chainCtx)!

export const TokenProvider = createContext<{
  name: string
  decimals: number
}>({ name: "DOT", decimals: 10 })
export const useToken = () => useContext(TokenProvider)
