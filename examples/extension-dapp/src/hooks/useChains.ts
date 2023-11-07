import type {
  RawChain,
  LightClientProvider,
} from "@polkadot-api/light-client-extension-helpers/web-page"
import { useEffect, useRef, useState } from "react"

export const useChains = (provider: LightClientProvider) => {
  const [chains, setChains] = useState<Record<string, RawChain>>({})
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    ;(async () => {
      const chains = await provider.getChains()
      if (!isMounted.current) return
      setChains(chains)
    })()
  }, [provider])

  useEffect(
    () => provider.addChainsChangeListener((chains) => setChains(chains)),
    [provider],
  )

  return { chains }
}
