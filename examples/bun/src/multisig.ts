import { getMultisigTxCreator } from "@polkadot-api/meta-signers"
import { AccountId, Binary } from "polkadot-api"
import { take } from "rxjs"
import { getDevTxCreator } from "./signer"
import { createWsClient } from "polkadot-api/ws"
import { pah } from "@polkadot-api/descriptors"

const creators = ["//Alice", "//Bob", "//Charlie"].map((v) =>
  getDevTxCreator(v),
)
const accId = AccountId(0)
const addrs = creators.map(({ publicKey }) => accId.dec(publicKey))
console.log(addrs)

const client = createWsClient("wss://sys.ibp.network/asset-hub-paseo")
const api = client.getTypedApi(pah)

const multisigCreators = creators.map((v) =>
  getMultisigTxCreator(
    {
      threshold: 2,
      signatories: addrs,
    },
    api.query.Multisig.Multisigs.getValue,
    api.apis.TransactionPaymentApi.query_info,
    v,
  ),
)

client.finalizedBlock$.pipe(take(1)).subscribe(() => console.log("connected"))

const tx = api.tx.System.remark({
  remark: Binary.fromText("We are very good friends!"),
})

tx.createSubmitAndWatch(multisigCreators[0]).subscribe({
  next(value) {
    console.log(value)
    if (value.type === "finalized") {
      if (value.dispatchError) {
        console.log(
          (value.dispatchError.value as any)?.type,
          (value.dispatchError.value as any)?.value,
        )
      }
      const newMultisig = api.event.Multisig.NewMultisig.filter(value.events)
      const approval = api.event.Multisig.MultisigApproval.filter(value.events)
      const executed = api.event.Multisig.MultisigExecuted.filter(value.events)
      console.log({
        newMultisig,
        approval,
        executed,
      })
      tx.createSubmitAndWatch(multisigCreators[1]).subscribe((v) => {
        if (v.type === "finalized") {
          if (v.dispatchError) {
            console.log(
              (v.dispatchError.value as any)?.type,
              (v.dispatchError.value as any)?.value,
            )
          }
          const newMultisig = api.event.Multisig.NewMultisig.filter(v.events)
          const approval = api.event.Multisig.MultisigApproval.filter(v.events)
          const executed = api.event.Multisig.MultisigExecuted.filter(v.events)
          console.log({
            newMultisig,
            approval,
            executed,
          })
          process.exit(0)
        }
      })
    }
  },
  error(err) {
    console.error(err)
  },
})
