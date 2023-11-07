import {
  type LightClientProvider,
  getLightClientProvider,
} from "@polkadot-api/light-client-extension-helpers/web-page"
import { useEffect, useRef, useState } from "react"

const providers = new Map<string, Promise<LightClientProvider>>()

export const useLightClientProvider = (channelId: string) => {
  const [provider, setProvider] = useState<LightClientProvider>()
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    if (!providers.has(channelId))
      providers.set(channelId, getLightClientProvider(channelId))
    providers.get(channelId)?.then((provider) => {
      if (!isMounted.current) return
      setProvider(provider)
    })
  }, [channelId])

  return { provider }
}
