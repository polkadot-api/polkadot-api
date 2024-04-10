import { PropsWithChildren } from "react"
import { AccountProvider } from "./AccountProvider"
import { ExtensionProvider } from "./ExtensionProvider"
import { TokenProvider } from "./TokenProvider"

export const MainProvider: React.FC<PropsWithChildren> = ({ children }) => (
  <TokenProvider.Provider
    value={{
      symbol: "WND",
      decimals: 12,
    }}
  >
    <ExtensionProvider>
      <AccountProvider>{children}</AccountProvider>
    </ExtensionProvider>
  </TokenProvider.Provider>
)
