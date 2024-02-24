import { createClient } from "@polkadot-api/client"
import "./style.css"

import {
  Account,
  getLegacyProvider,
} from "@polkadot-api/legacy-polkadot-provider"
import { createScClient } from "@substrate/connect"
import test, { MultiAddress } from "./codegen/wnd"

const { relayChains, connectAccounts } = getLegacyProvider(createScClient())
connectAccounts("polkadot-js")

const chain = relayChains.westend2
const client = createClient(chain.connect, { test })

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
  client.test.tx.Balances.transfer_keep_alive({
    dest: MultiAddress.Id(billy.address),
    value: amount,
  })
    .submit$(alexa.address)
    .subscribe({
      next: (event) => {
        console.log(event)
      },
      error: console.error,
    })
}
