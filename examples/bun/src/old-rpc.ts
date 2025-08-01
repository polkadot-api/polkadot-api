import { createClient } from "@polkadot-api/substrate-client"
import { withLogsRecorder } from "polkadot-api/logs-provider"
import { getWsProvider } from "polkadot-api/ws-provider/web"
import { createUpstream } from "@polkadot-api/legacy-provider"
import { take } from "rxjs"

const upstream = createUpstream(
  withLogsRecorder(console.log, getWsProvider("wss://fullnode.centrifuge.io/")),
)

upstream.getBlocks("foo").blocks$.subscribe(console.log, console.error)

/*
finalized$.pipe(take(2)).subscribe((x) => {
  console.log({ finalized: x.hash, number: x.number })
}, console.error)
newHeads$.pipe(take(3)).subscribe(console.log, console.error)

fromShittyHeader({
  parentHash:
    "0xad5995efae31bd9eb0b37eb55a127f0db5f5cbd8ba7aa79d71314965db171b66",
  number: "0x8034e4",
  stateRoot:
    "0x47daa6b03e7b9a347ae666760be0f919f92f35d5dceceb867f0204dc902488dc",
  extrinsicsRoot:
    "0x02d01b148574bb6077652b25567642ddfca98424a0e79f672b8f5f5ce0a83114",
  digest: {
    logs: [
      "0x06617572612082d5b50800000000",
      "0x0452505352909578b12648423a09fa82c4ddf5ce1197f59c67bfda04ec15bd2eaa03a755489616a67306",
      "0x0466726f6e880153a7b729c869a04a693ca54da6998965e959a67e76fb8592cc27143865d2d1c100",
      "0x05617572610101f83f48727514fbdc6d861a3b683a4bc6fe9d7677397507c24edd349d41b3133d25e9893dc16025e19c88284ec1ce1316d009aab9d4fe8c605763e25833f2288a",
    ],
  },
})
*/

/*
const client = createClient(
  withLogsRecorder(console.log, getWsProvider("wss://fullnode.centrifuge.io/")),
)
*/

/*
client._request("chain_subscribeNewHeads", [])
const foo = {
  parentHash:
    "0xad5995efae31bd9eb0b37eb55a127f0db5f5cbd8ba7aa79d71314965db171b66",
  number: "0x8034e4",
  stateRoot:
    "0x47daa6b03e7b9a347ae666760be0f919f92f35d5dceceb867f0204dc902488dc",
  extrinsicsRoot:
    "0x02d01b148574bb6077652b25567642ddfca98424a0e79f672b8f5f5ce0a83114",
  digest: {
    logs: [
      "0x06617572612082d5b50800000000",
      "0x0452505352909578b12648423a09fa82c4ddf5ce1197f59c67bfda04ec15bd2eaa03a755489616a67306",
      "0x0466726f6e880153a7b729c869a04a693ca54da6998965e959a67e76fb8592cc27143865d2d1c100",
      "0x05617572610101f83f48727514fbdc6d861a3b683a4bc6fe9d7677397507c24edd349d41b3133d25e9893dc16025e19c88284ec1ce1316d009aab9d4fe8c605763e25833f2288a",
    ],
  },
}
*/

/*
client._request("state_call", [
  "AccountNonceApi_account_nonce",
  "0xd6ebcc75c7ea9a0c4459162b495e90c7ed5306e3a27f73125d6fbd2a34601323",
])
1-2025-07-27T12:52:17.596Z->>-{"jsonrpc":"2.0","id":"1-1","method":"state_call","params":["AccountNonceApi_account_nonce","0xd6ebcc75c7ea9a0c4459162b495e90c7ed5306e3a27f73125d6fbd2a34601323"]}
1-2025-07-27T12:52:17.791Z-<<-{"jsonrpc":"2.0","result":"0x00000000","id":"1-1"}
*/

/*
client._request("chain_getBlockHash", ["0x8034e4"])
1-2025-07-27T13:22:34.552Z->>-{"jsonrpc":"2.0","id":"1-1","method":"chain_getBlockHash","params":["0x8034e4"]}
1-2025-07-27T13:22:34.806Z-<<-{"jsonrpc":"2.0","result":"0x7eaab467f3970a28b0199553a8ee895de9dbc11e96e281c64a7bff95dcfcc357","id":"1-1"}
*/

/*
client._request("chain_getBlock", [
  "0x7eaab467f3970a28b0199553a8ee895de9dbc11e96e281c64a7bff95dcfcc357",
])
*/
