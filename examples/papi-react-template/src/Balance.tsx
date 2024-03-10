import { useEffect, useState } from "react"
import { useChain, useSelectedAccount, useToken } from "./hooks"
import { formatCurrency } from "./utils"

export const Balance: React.FC = () => {
  const account = useSelectedAccount()
  const { api } = useChain()
  const [balance, setBalance] = useState<{
    free: bigint
    reserved: bigint
    frozen: bigint
  }>()

  const { decimals } = useToken()
  useEffect(() => {
    const subscription = api.query.System.Account.watchValue(
      account,
      "best",
    ).subscribe(({ data }) => {
      setBalance(data)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [api, account])

  return !balance ? (
    <div>Loading...</div>
  ) : (
    <div>
      <strong>Free Balance:</strong>{" "}
      {formatCurrency(balance.free, decimals, { nDecimals: 2 })}
    </div>
  )
}
