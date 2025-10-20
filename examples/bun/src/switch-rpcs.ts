import { wnd } from "@polkadot-api/descriptors"
import { createWsClient } from "polkadot-api/ws"

const client = createWsClient(
  ["wss://api.interlay.io/parachain", "wss://rpc-interlay.luckyfriday.io/"],
  {
    onStatusChanged: (x) => {
      console.log(x.type)
      console.log(x)
    },
  },
)
const testApi = client.getTypedApi(wnd)

client.finalizedBlock$.subscribe(console.log, console.error)
testApi.query.System.Account.watchValue(
  "5GvW9jJnq5J7KYAtYfdi88zXxVT3Z6dHHr6cgBgMpkVhPVrp",
).subscribe(console.log, console.error)

console.log("sync switch")
client.switch()

let nTries = 1
const switchWs = async () => {
  if (nTries++ > 8) {
    client.destroy()
    return
  }
  await new Promise((res) => setTimeout(res, 5_000))
  console.log("switching")
  client.switch()
  switchWs()
}

switchWs()
