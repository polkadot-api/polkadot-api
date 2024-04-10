import { useEffect, useState } from "react"
import { useChain } from "./context"

const useBlockNumber = (type: "finalized" | "best") => {
  const { client } = useChain()
  const [blockNumber, setBlockNumber] = useState<number | null>()

  useEffect(() => {
    const subscription = client.bestBlocks$.subscribe((blocks) => {
      const block = type === "best" ? blocks[0] : blocks[blocks.length - 1]
      setBlockNumber(block.number)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [client, type])

  return blockNumber
}

const formatNumber = new Intl.NumberFormat().format

export const BlockNumbers: React.FC = () => {
  const finalized = useBlockNumber("finalized")
  const best = useBlockNumber("best")

  if (!finalized) return null

  return (
    <div
      style={{
        marginTop: "-25px",
        marginBottom: "15px",
      }}
    >
      (#{formatNumber(finalized)}
      {best && best !== finalized ? <> - #{formatNumber(best)}</> : null})
    </div>
  )
}
