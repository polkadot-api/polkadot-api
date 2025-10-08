import { createClient } from "polkadot-api"
import { getWsProvider, WsEvent } from "polkadot-api/ws-provider"
import { wnd } from "@polkadot-api/descriptors"
const wsEvents = {
  [WsEvent.CLOSE]: "CLOSE",
  [WsEvent.ERROR]: "ERROR",
  [WsEvent.CONNECTED]: "CONNECTED",
  [WsEvent.CONNECTING]: "CONNECTING",
}

const wsProvider = getWsProvider(
  ["wss://api.interlay.io/parachain", "wss://rpc-interlay.luckyfriday.io/"],
  {
    onStatusChanged: (x) => {
      console.log(wsEvents[x.type])
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

let nTries = 1
const switchWs = async () => {
  if (nTries++ > 4) {
    console.log("done!")
    client.destroy()
    return
  }
  await new Promise((res) => setTimeout(res, 15_000))
  console.log("switching")
  wsProvider.switch()
  switchWs()
}

switchWs()
