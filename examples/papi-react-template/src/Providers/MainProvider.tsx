import { PropsWithChildren } from "react"
import { TokenProvider } from "../hooks"
import { AccountProvider } from "./AccountProvider"
import { ExtensionProvider } from "./ExtensionProvider"

export const MainProvider: React.FC<PropsWithChildren> = ({ children }) => (
  <TokenProvider.Provider
    value={{
      name: "DOT",
      decimals: 10,
    }}
  >
    <ExtensionProvider>
      <AccountProvider>{children}</AccountProvider>
    </ExtensionProvider>
  </TokenProvider.Provider>
)
