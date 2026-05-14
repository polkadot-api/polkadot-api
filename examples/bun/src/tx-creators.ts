import { createWsClient } from "polkadot-api/ws"
import { wnd } from "@polkadot-api/descriptors"
import { getDevSigner } from "./signer"
import { getTxCreator } from "polkadot-api/signer"
import { Binary } from "polkadot-api"

const signer = getDevSigner()
const client = createWsClient("ws://localhost:8131")
const api = client.getTypedApi(wnd)
const creatorFactory = getTxCreator(signer.publicKey, "Sr25519", signer.rawSign)
const txCreator = creatorFactory(api)

const tx = await api.tx.System.remark_with_event({
  remark: Binary.fromText("FIRST TX WITH CREATOR"),
}).create(txCreator, {})

client.submitAndWatch(tx).subscribe(console.log)
