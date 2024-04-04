import { JsonRpcProvider } from "@polkadot-api/sc-provider"
import { WellKnownChain } from "@substrate/connect"
import { createClient } from "@polkadot-api/substrate-client"
import { createProvider } from "./smolldot-worker"
import { getObservableClient } from "@polkadot-api/observable-client"
import { firstValueFrom } from "rxjs"

const provider = createProvider(WellKnownChain.polkadot)

const withLogsProvider = (input: JsonRpcProvider): JsonRpcProvider => {
  return (onMsg) => {
    const result = input((msg) => {
      console.log("<< " + msg)
      onMsg(msg)
    })

    return {
      ...result,
      send: (msg) => {
        console.log(">> " + msg)
        result.send(msg)
      },
    }
  }
}

export const { chainHead$, destroy } = getObservableClient(
  createClient(withLogsProvider(provider)),
)
const chainHead = chainHead$()
const allNominators$ = chainHead.storage$(
  null,
  "descendantsValues",
  () => "0x5f3e4907f716ac89b6347d15ececedca88dcde934c658227ee1dfafcd6e16903",
  null,
)

try {
  const nominators = await firstValueFrom(allNominators$)
  console.log(nominators)
} catch (err) {
  console.error(err)
}

chainHead.unfollow()
destroy()
