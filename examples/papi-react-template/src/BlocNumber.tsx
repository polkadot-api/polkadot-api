import { useEffect, useState } from "react"
import { useChain, useSelectedAccount } from "./hooks"

const formatNumber = new Intl.NumberFormat().format

export const BlockNumber: React.FC<{ type: "best" | "finalized" }> = ({
  type,
}) => {
  const account = useSelectedAccount()
  const { api } = useChain()
  const [blockNumber, setBlockNumber] = useState<number>()
  useEffect(() => {
    const subscription =
      api.query.System.Number.watchValue(type).subscribe(setBlockNumber)

    return () => {
      subscription.unsubscribe()
    }
  }, [api, account])

  return <>{formatNumber(blockNumber as number)}</>
}
