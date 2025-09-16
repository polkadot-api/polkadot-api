import { createClient } from "polkadot-api"
import { getWsProvider } from "polkadot-api/ws-provider"
import { wnd } from "@polkadot-api/descriptors"

const wsProvider = getWsProvider(
  [
    "wss://polkadot-rpc.publicnode.com",
    "wss://polkadot-public-rpc.blockops.network/ws",
    "wss://rpc.ibp.network/polkadot",
    "wss://rpc-polkadot.luckyfriday.io",
    "wss://polkadot.api.onfinality.io/public-ws",
  ],
  {
    onStatusChanged: (x) => {
      console.log(x)
    },
  },
)
const client = createClient(wsProvider)
const testApi = client.getTypedApi(wnd)

client.finalizedBlock$.subscribe(console.log, console.error)
testApi.query.System.Account.watchValue(
  "5GvW9jJnq5J7KYAtYfdi88zXxVT3Z6dHHr6cgBgMpkVhPVrp",
).subscribe(console.log, console.error)

console.log("sync switch")
wsProvider.switch()

const switchWs = async () => {
  await new Promise((res) => setTimeout(res, 12_000))
  console.log("switching")
  wsProvider.switch()
  switchWs()
}

switchWs()
