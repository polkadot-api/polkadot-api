import { getVerSigV5Signer } from "polkadot-api/signer"
import { getDevSigner } from "./signer"
import { createWsClient } from "polkadot-api/ws"
import { wnd } from "@polkadot-api/descriptors"
import { Binary } from "polkadot-api"

const alice = getDevSigner()
const signerV5 = getVerSigV5Signer(
  alice.signer.publicKey,
  "Sr25519",
  alice.rawSign,
)

const client = createWsClient("ws://localhost:8132")
const api = client.getTypedApi(wnd)

api.tx.System.remark_with_event({
  remark: Binary.fromText("THIS IS V5 GENERAL"),
})
  .signSubmitAndWatch(signerV5)
  .subscribe(console.log)
