import type { Pah } from "@polkadot-api/descriptors"
import { Binary } from "polkadot-api"
import { createWsClient } from "polkadot-api/ws"
import { finalize } from "rxjs"
import { getDevVerifySignatureTxCreator } from "./verifyMultiSignatureTxCreator"

const client = createWsClient("wss://polkadot-test.substrate.dev/asset-hub")
const api = client.getUnsafeApi<Pah>()

const aliceSigner = getDevVerifySignatureTxCreator()

api.tx.System.remark({
  remark: Binary.fromText("Hey!"),
})
  .createSubmitAndWatch(aliceSigner)
  .pipe(finalize(() => client.destroy()))
  .subscribe({
    next: (r) => {
      console.log(r)
    },
    error: (e) => console.error(e),
  })
