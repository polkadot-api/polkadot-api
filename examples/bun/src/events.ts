import { sr25519CreateDerive } from "@polkadot-labs/hdkd"
import {
  DEV_PHRASE,
  entropyToMiniSecret,
  mnemonicToEntropy,
} from "@polkadot-labs/hdkd-helpers"
import { getPolkadotSigner, withMetadataHash } from "polkadot-api/signer"
import { createClient } from "polkadot-api"
import { MultiAddress, wnd } from "@polkadot-api/descriptors"
import { chainSpec } from "polkadot-api/chains/westend"
import { getSmProvider } from "polkadot-api/sm-provider"
import { start } from "polkadot-api/smoldot"
import { filter } from "rxjs"

// let's create Bob signer
const miniSecret = entropyToMiniSecret(mnemonicToEntropy(DEV_PHRASE))
const derive = sr25519CreateDerive(miniSecret)
const bobKeyPair = derive("//Bob")
const bob = getPolkadotSigner(bobKeyPair.publicKey, "Sr25519", bobKeyPair.sign)

// create the client with smoldot
const smoldot = start()
const client = createClient(
  getSmProvider(() => smoldot.addChain({ chainSpec })),
)

console.log("Waiting for initial finalized…")
await client.getFinalizedBlock()

// get the safely typed API
const typedApi = client.getTypedApi(wnd)

// Subscribe to finalized events
const watchSub = typedApi.event.Balances.Transfer.watch()
  .pipe(filter((value) => value.events.length > 0))
  .subscribe((evt) => console.log("watch (finalized)", evt.block, evt.events))

// Subscribe to best-block events
const watchBestSub = typedApi.event.Balances.Transfer.watchBest()
  .pipe(filter((value) => value.events.length > 0))
  .subscribe((evt) => console.log("watchBest", evt.type, evt.block, evt.events))

// create the transaction sending ALICE some assets
const ALICE = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
typedApi.tx.Balances.transfer_allow_death({
  dest: MultiAddress.Id(ALICE),
  value: 12345n,
})
  .signSubmitAndWatch(bob)
  .subscribe(async (r) => {
    console.log({
      type: r.type,
      hash: r.txHash,
    })

    if (r.type === "finalized") {
      await new Promise((res) => setTimeout(res, 3000))
      watchSub.unsubscribe()
      watchBestSub.unsubscribe()
      client.destroy()
      smoldot.terminate()
    }
  })
