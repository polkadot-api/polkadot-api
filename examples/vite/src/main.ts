import { PolkadotClient, TypedApi, createClient } from "@polkadot-api/client"
import "./style.css"
import { MultiAddress, wnd } from "@polkadot-api/client/descriptors"
import {
  Account,
  getLegacyProvider,
} from "@polkadot-api/legacy-polkadot-provider"
import { createScClient } from "@substrate/connect"

const { relayChains, connectAccounts } = getLegacyProvider(createScClient())
connectAccounts("polkadot-js")

const chain = relayChains.westend2
const client: PolkadotClient = createClient(chain.provider)
const testApi: TypedApi<typeof wnd> = client.getTypedApi(wnd)

const assetRateTransactions: TypedApi<typeof wnd>["tx"]["AssetRate"] =
  testApi.tx.AssetRate

const isCompatible = await assetRateTransactions.create.isCompatible()
console.log({ isCompatible })

const constantIsCompatible =
  await testApi.constants.Auctions.EndingPeriod.isCompatible()

console.log({ constantIsCompatible })
const constant = await testApi.constants.Auctions.EndingPeriod()

const runtime = await testApi.runtime.latest()
const isCompatible2 = testApi.tx.AssetRate.create.isCompatible(runtime)
const constant2 = testApi.constants.Auctions.EndingPeriod(runtime)

const accounts = await chain.getAccounts()

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
    option.text = account.displayName!
    select.appendChild(option)
  })

  return select
}

function transfer(alexa: Account, billy: Account, amount: bigint) {
  testApi.tx.Balances.transfer_keep_alive({
    dest: MultiAddress.Id(billy.address),
    value: amount,
  })
    .signSubmitAndWatch(alexa.address)
    .subscribe({
      next: (event) => {
        console.log(event)
      },
      error: console.error,
    })
}
