import { Account } from "@polkadot-api/legacy-polkadot-provider"
import { PropsWithChildren, useEffect, useState } from "react"
import { relayChains } from "../api"
import { SelectedAccountCtx } from "../hooks"

export const AccountProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>()

  useEffect(
    () =>
      relayChains.polkadot.onAccountsChange((accounts) => {
        setSelectedAccount((x) => x ?? accounts[0])
        setAccounts(accounts)
      }),
    [],
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
              {account.displayName} - {account.address}
            </option>
          ))}
        </select>
      </label>
      <p>
        <strong>Selected Account:</strong>{" "}
        {selectedAccount
          ? selectedAccount.displayName || selectedAccount.address
          : "None"}
      </p>
      {selectedAccount && (
        <SelectedAccountCtx.Provider value={selectedAccount.address}>
          {children}
        </SelectedAccountCtx.Provider>
      )}
    </div>
  )
}
