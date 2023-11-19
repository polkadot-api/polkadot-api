import { createClient } from "@polkadot-api/client"
import "./style.css"

import {
  Account,
  getLegacyProvider,
  knownChainsData,
} from "@polkadot-api/legacy-polkadot-provider"
import { createScClient } from "@substrate/connect"
import testDescriptors from "./codegen/test"

const provider = getLegacyProvider(createScClient())
const chain = provider.getChains()[knownChainsData.westend2.chainId]
const client = createClient(chain.connect, testDescriptors)

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
  client.tx.Balances.transfer_keep_alive
    .submit$(
      alexa.address,
      {
        tag: "Id",
        value: billy.address,
      },
      amount,
    )
    .subscribe({
      next: (event) => {
        console.log(event)
      },
      error: console.error,
    })
}
