import { createClient } from "polkadot-api"
import { withLogsRecorder } from "polkadot-api/logs-provider"
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat"
import { getWsProvider } from "polkadot-api/ws-provider/web"

const client = createClient(
  withPolkadotSdkCompat(
    withLogsRecorder(
      console.log,
      getWsProvider("wss://fullnode.centrifuge.io/"),
    ),
  ),
)

const api = client.getUnsafeApi()

console.log(await client.getFinalizedBlock())

console.log("waiting runtime token")
console.log(await api.runtimeToken)
console.log("got runtime token")

console.log(
  await api.query.System.Account.getValue(
    "5GvW9jJnq5J7KYAtYfdi88zXxVT3Z6dHHr6cgBgMpkVhPVrp",
  ),
)
