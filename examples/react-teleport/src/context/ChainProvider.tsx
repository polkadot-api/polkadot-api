import { PolkadotClient } from "polkadot-api"
import { createContext, useContext } from "react"
import { ParaChainApi, RelayChainApi } from "../api"

export const chainCtx = createContext<{
  client: PolkadotClient
  api: ParaChainApi | RelayChainApi
} | null>(null)
export const useChain = () => useContext(chainCtx)!

export const ChainProvider = chainCtx.Provider
