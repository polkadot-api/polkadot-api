import { createClient } from "@polkadot-api/client"
import "./style.css"

import {
  Account,
  getLegacyProvider,
  knownChainsData,
} from "@polkadot-api/legacy-polkadot-provider"
import { createScClient } from "@substrate/connect"
import liam from "./codegen/ksm"

const provider = getLegacyProvider(createScClient())

const chain = provider.getChains()[knownChainsData.polkadot.chainId]

const client = createClient(chain.connect, liam)

const unstakeHeadP = client.query.FastUnstake.Head.getValue()
const queueP = client.query.FastUnstake.Queue.getEntries()
const qu = client.query.FastUnstake.CounterForQueue.getValue()
const asdf = client.query.FastUnstake.ErasToCheckPerBlock.getValue()

const [head, queue, counterForQueu, erasToHeckPerBlock] = await Promise.all([
  unstakeHeadP,
  queueP,
  qu,
  asdf,
] as const)
head

console.log({ head, queue, counterForQueu, erasToHeckPerBlock })

/*
const validators = await client.query.Staking.Validators.getEntries()

console.log(
  validators.map(({ keyArgs: [address], value }) => {
    return {
      address,
      ...value,
    }
  }),
)
*/

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
