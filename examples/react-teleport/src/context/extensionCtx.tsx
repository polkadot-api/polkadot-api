import {
  InjectedExtension,
  getInjectedExtensions,
} from "polkadot-api/pjs-signer"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

const getJoinedInjectedExtensions = () =>
  (getInjectedExtensions() ?? []).join(",")

export const useAvailableExtensions = (frequencyUpdate = 200): string[] => {
  const [extensions, setExtensions] = useState<string>(
    getJoinedInjectedExtensions,
  )

  useEffect(() => {
    const token = setTimeout(() => {
      setExtensions(getJoinedInjectedExtensions())
    }, frequencyUpdate)

    return () => {
      clearTimeout(token)
    }
  }, [frequencyUpdate])

  return useMemo(() => extensions.split(","), [extensions])
}

export const extensionCtx = createContext<InjectedExtension | null>(null)
export const useSelectedExtension = () => useContext(extensionCtx)!
