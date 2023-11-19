import { ConnectProvider, WellKnownChain } from "@polkadot-api/sc-provider"
import { createClient } from "@polkadot-api/substrate-client"
import { createProvider } from "./smolldot-worker"
import { getObservableClient } from "@polkadot-api/client"
import { filter, firstValueFrom } from "rxjs"
import { getLookupFn } from "@polkadot-api/substrate-codegen"

const provider = createProvider(WellKnownChain.ksmcc3)

const withLogsProvider = (input: ConnectProvider): ConnectProvider => {
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

const metadata = await firstValueFrom(chainHead.metadata$.pipe(filter(Boolean)))

const look = getLookupFn(metadata.lookup)

metadata.pallets.forEach((p) => {
  if (!p.errors) return
  const errors = look(p.errors)
  if (errors.type !== "enum") return
  Object.entries(errors.value).forEach(([key, val]) => {
    if (val.type !== "primitive") {
      console.log(p.name, key)
    }
  })
})

/*
const allNominators$ = chainHead.storage$(
  null,
  "descendantsValues",
  "0x5f3e4907f716ac89b6347d15ececedca88dcde934c658227ee1dfafcd6e16903",
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
*/
