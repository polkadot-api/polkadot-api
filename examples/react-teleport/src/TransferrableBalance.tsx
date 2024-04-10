import { useEffect, useState } from "react"
import { SS58String } from "polkadot-api"
import { useChain, useToken, useSelectedAccount } from "./context"
import { formatCurrency } from "./utils"

const useTranferrableBalance = (address: SS58String) => {
  const { api } = useChain()
  const [balance, setBalance] = useState<bigint | null>(null)
  useEffect(() => {
    setBalance(null)

    const subscription = api.query.System.Account.watchValue(
      address,
      "best",
    ).subscribe(({ data }) => {
      setBalance(data.free - data.frozen)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [api, address])

  return balance
}

export const TransferrableBalance: React.FC = () => {
  const { decimals, symbol } = useToken()
  const { address } = useSelectedAccount()
  const transferrableBalance = useTranferrableBalance(address)

  return (
    <div>
      <strong>Transferrable Balance:</strong>{" "}
      {transferrableBalance === null
        ? "Loading..."
        : formatCurrency(transferrableBalance, decimals, {
            nDecimals: 2,
          }) +
          " " +
          symbol}
    </div>
  )
}
