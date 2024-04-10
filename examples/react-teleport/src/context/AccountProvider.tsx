import { type InjectedPolkadotAccount } from "polkadot-api/pjs-signer"
import { PropsWithChildren, useEffect, useState } from "react"
import { useSelectedExtension } from "./extensionCtx"
import { SelectedAccountCtx } from "./accountCtx"

export const AccountProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [accounts, setAccounts] = useState<InjectedPolkadotAccount[]>([])
  const [selectedAccount, setSelectedAccount] = useState<
    InjectedPolkadotAccount | undefined
  >()
  const extension = useSelectedExtension()

  useEffect(
    () =>
      extension.subscribe((accounts) => {
        setSelectedAccount((x) => x ?? accounts[0])
        setAccounts(accounts)
      }),
    [extension],
  )

  return (
    <div>
      <label>
        Select Account:
        <select
          value={selectedAccount?.address}
          onChange={(e) => {
            setSelectedAccount(
              accounts.find((a) => a.address === e.target.value),
            )
          }}
        >
          {accounts.map((account) => (
            <option key={account.address} value={account.address}>
              {account.name} - {account.address.slice(0, 9)}...
            </option>
          ))}
        </select>
      </label>
      <p>
        <strong>Selected Account:</strong>{" "}
        {selectedAccount
          ? selectedAccount.name || selectedAccount.address
          : "None"}
      </p>
      {selectedAccount && (
        <SelectedAccountCtx.Provider value={selectedAccount}>
          {children}
        </SelectedAccountCtx.Provider>
      )}
    </div>
  )
}
