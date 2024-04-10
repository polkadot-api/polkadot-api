import {
  InjectedExtension,
  connectInjectedExtension,
} from "polkadot-api/pjs-signer"
import { PropsWithChildren, useState } from "react"
import { extensionCtx, useAvailableExtensions } from "./extensionCtx"

export const ExtensionProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const availableExtensions = useAvailableExtensions()
  const [selectedExtension, setSelectedExtension] =
    useState<InjectedExtension | null>(null)

  if (availableExtensions.length === 0)
    return <div>No extension provider detected</div>

  if (!selectedExtension)
    return (
      <div>
        <label>Select Extension:</label>
        <ul>
          {availableExtensions.map((extension) => (
            <li key={extension}>
              <button
                style={{ margin: "5px" }}
                type="button"
                onClick={() => {
                  connectInjectedExtension(extension).then(setSelectedExtension)
                }}
              >
                {extension}
              </button>{" "}
            </li>
          ))}
        </ul>
      </div>
    )

  return (
    <>
      <button
        onClick={() => {
          setSelectedExtension(null)
        }}
      >
        Disconnect
      </button>
      <extensionCtx.Provider value={selectedExtension}>
        {children}
      </extensionCtx.Provider>
    </>
  )
}
