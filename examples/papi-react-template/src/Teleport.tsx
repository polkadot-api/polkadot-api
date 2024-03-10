import { useRef } from "react"
import { useSelectedAccount, useToken } from "./hooks"
import { teleportToParaChain, teleportToRelayChain } from "./api"

const teleportFns = {
  para: teleportToParaChain,
  relay: teleportToRelayChain,
}

export const Teleport: React.FC = () => {
  const { decimals } = useToken()
  const account = useSelectedAccount()
  const ref = useRef<bigint>(0n)

  const teleport = (to: "para" | "relay") => {
    teleportFns[to](account, ref.current)
      .submit$(account)
      .subscribe((x) => {
        console.log(x)
      })
  }

  return (
    <div>
      <h2>Teleport: </h2>
      <button onClick={() => teleport("relay")}>To Relay Chain</button>
      <input
        type="number"
        onChange={(e) => {
          ref.current = BigInt(Number(e.target.value) * decimals ** 10)
        }}
        defaultValue={0}
      />
      <button onClick={() => teleport("para")}>To ParaChain</button>
    </div>
  )
}
