import { PropsWithChildren, useState } from "react"
import { useAvailableExtensions } from "../hooks"
import { connectAccounts } from "../api"

export const ExtensionProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const availableExtensions = useAvailableExtensions()
  const [selectedExtension, setSelectedExtension] = useState<string | null>(
    null,
  )

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
                type="button"
                onClick={() => {
                  connectAccounts(extension)
                  setSelectedExtension(extension)
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
          connectAccounts(null)
          setSelectedExtension(null)
        }}
      >
        Disconnect
      </button>
      {children}
    </>
  )
}
