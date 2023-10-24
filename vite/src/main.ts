import "./style.css"
import "./console.js"

import {
  AccountId,
  Enum,
  Struct,
  compact,
  u8,
} from "@polkadot-api/substrate-bindings"
import { toHex } from "@polkadot-api/utils"
import {
  Account,
  getLegacyProvider,
  knownChainsData,
} from "@polkadot-api/legacy-polkadot-provider"
import { createClient } from "@polkadot-api/substrate-client"

const provider = await getLegacyProvider()

const westend = provider.getChains()[knownChainsData.westend2.chainId]

await new Promise((res) => setTimeout(res, 500))

const accounts = westend.getAccounts()
const jsonRPCProvider = westend.connect(() => {})

console.log("westend accounts", accounts)

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

async function transfer(alexa: Account, billy: Account, amount: bigint) {
  const prefix = 42
  const codec = AccountId(prefix)

  const call = Struct({
    module: u8,
    method: u8,
    args: Struct({
      dest: Enum({
        Id: codec,
      }),
      value: compact,
    }),
  })

  const rawTx = await jsonRPCProvider.createTx(
    alexa.publicKey,
    call.enc({
      module: 4,
      method: 3,
      args: {
        dest: {
          tag: "Id",
          value: codec.dec(billy.publicKey),
        },
        value: amount,
      },
    }),
  )

  console.log("rawTx")
  console.log(toHex(rawTx))

  // How to submit this badboy?
  const transaction = toHex(rawTx)
  console.log("transaction", transaction)

  // -----------------
  // making a 2nd client here

  const client = createClient(westend.connect)

  client.transaction(
    transaction,
    (e) => {
      console.log("tx event:", e)
    },
    (e) => {
      console.error("there was an error ", e)
    },
  )
}
