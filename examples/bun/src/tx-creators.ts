import { createWsClient } from "polkadot-api/ws"
import { wnd } from "@polkadot-api/descriptors"
import { getDevTxCreator } from "./signer"
import { Binary } from "polkadot-api"

const client = createWsClient("ws://localhost:8131")
const api = client.getTypedApi(wnd)
const txCreator = getDevTxCreator()(api)

const tx = await api.tx.System.remark_with_event({
  remark: Binary.fromText("FIRST TX WITH CREATOR"),
}).create(txCreator, {})

client.submitAndWatch(tx).subscribe(console.log)
