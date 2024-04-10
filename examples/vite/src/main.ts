import { PolkadotClient, TypedApi, createClient } from "@polkadot-api/client"
import { MultiAddress, wnd } from "@polkadot-api/descriptors"
import {
  getInjectedExtensions,
  connectInjectedExtension,
  InjectedPolkadotAccount,
} from "@polkadot-api/client/pjs-signer"
import SmWorker from "@polkadot-api/smoldot/worker?worker"
import { getSmProvider } from "@polkadot-api/client/sm-provider"
import { startFromWorker } from "@polkadot-api/smoldot/from-worker"
import "./style.css"

const smoldot = startFromWorker(new SmWorker())

const connection: PolkadotClient = createClient(
  getSmProvider(
    import("@polkadot-api/known-chains/westend2").then(
      ({ default: chainSpec }) => smoldot.addChain({ chainSpec }),
    ),
  ),
)
const testApi: TypedApi<typeof wnd> = connection.getTypedApi(wnd)

while (!getInjectedExtensions()?.includes("polkadot-js"))
  await new Promise((res) => setTimeout(res, 50))

const pjs = await connectInjectedExtension("polkadot-js")
const accounts = pjs.getAccounts()

const alexaDropdown = document.getElementById("alexa") as HTMLSelectElement
const billyDropdown = document.getElementById("billy") as HTMLSelectElement
const amountInput = document.getElementById("amount") as HTMLInputElement
const submitButton = document.getElementById("submit") as HTMLButtonElement

populateUserDropdown(alexaDropdown)
populateUserDropdown(billyDropdown)
submitButton.addEventListener("click", () => {
  transfer(
    accounts[+alexaDropdown.value],
    accounts[+billyDropdown.value],
    BigInt(amountInput.value),
  )
})

function populateUserDropdown(select: Element) {
  accounts.forEach((account, i) => {
    const option = document.createElement("option")
    option.setAttribute("value", `${i}`)
    option.text = account.name!
    select.appendChild(option)
  })

  return select
}

function transfer(
  alexa: InjectedPolkadotAccount,
  billy: InjectedPolkadotAccount,
  amount: bigint,
) {
  testApi.tx.Balances.transfer_keep_alive({
    dest: MultiAddress.Id(billy.address),
    value: amount,
  })
    .signSubmitAndWatch(alexa.polkadotSigner)
    .subscribe({
      next: (event) => {
        console.log(event)
      },
      error: console.error,
    })
}
