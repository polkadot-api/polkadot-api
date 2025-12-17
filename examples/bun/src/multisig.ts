import { wnd } from "@polkadot-api/descriptors"
import { getMultisigSigner } from "@polkadot-api/meta-signers"
import { sr25519CreateDerive } from "@polkadot-labs/hdkd"
import {
  entropyToMiniSecret,
  mnemonicToEntropy,
} from "@polkadot-labs/hdkd-helpers"
import { Binary, createClient } from "polkadot-api"
import { chainSpec } from "polkadot-api/chains/westend"
import { getPolkadotSigner } from "polkadot-api/signer"
import { getSmProvider } from "polkadot-api/sm-provider"
import { start } from "polkadot-api/smoldot"
import { take } from "rxjs"

const alice_mnemonic =
  "bottom drive obey lake curtain smoke basket hold race lonely fit walk"
const entropy = mnemonicToEntropy(alice_mnemonic)
const miniSecret = entropyToMiniSecret(entropy)
const derive = sr25519CreateDerive(miniSecret)
const alice = derive("//Alice")
const aliceSigner = getPolkadotSigner(alice.publicKey, "Sr25519", alice.sign)

const smoldot = start()
const client = createClient(
  getSmProvider(() => smoldot.addChain({ chainSpec })),
)
const api = client.getTypedApi(wnd)

const multisigSigner = getMultisigSigner(
  {
    threshold: 2,
    signatories: [
      "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
      "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
      "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y",
    ],
  },
  api.query.Multisig.Multisigs.getValue,
  api.apis.TransactionPaymentApi.query_info,
  aliceSigner,
)

client.finalizedBlock$.pipe(take(1)).subscribe(() => console.log("connected"))

const tx = api.tx.System.remark({
  remark: Binary.fromText("We are very good friends!"),
})

tx.signSubmitAndWatch(multisigSigner).subscribe({
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
      process.exit(0)
    }
  },
  error(err) {
    console.error(err)
  },
})
