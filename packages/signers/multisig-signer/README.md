# @polkadot-api/multisig-signer

Signer that wraps every transaction with a `Multisig.as_multi` for the provided multisig.

## Usage

```ts
function multisigSigner(
  multisig: {
    threshold: number
    signatories: SS58String[]
  },
  signer: PolkadotSigner,
): PolkadotSigner
```

Create a multisig signer by passing in the multisig information (threshold and list of signatories), and another signer of one the signatories.

## Example

```ts
import { multisigSigner } from "@polkadot-api/multisig-signer"
import {
  connectInjectedExtension,
  getInjectedExtensions,
} from "polkadot-api/pjs-signer"

// Grab a signer from a pjs extension
while (!getInjectedExtensions()?.includes("polkadot-js"))
  await new Promise((res) => setTimeout(res, 50))
const pjs = await connectInjectedExtension("polkadot-js")
const accounts = pjs.getAccounts()
const alice = accounts.find((account) => account.name === "Alice")

// Create a multisig signer with alice
const aliceMultisig = multisigSigner({
  threshold: 2,
  signatories: [
    "15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5",
    "12Ds7U7t2biJXnRY4jWvBu71UzvPMAr3SxXBm2iHqCFBU4Yx",
    "14u9dEGTLgwwzQ6oMm6bN2mt7xxwEko8qciKw9jg3Uc4pYjA",
  ],
})

// ... create a `typedApi` to the chain you want to connect to

// Send the transaction as multisig
await typedApi.tx.System.remark({
  remark: Binary.fromText("We are all very good friends"),
}).signAndSubmit(aliceMultisig)

// The transaction will be wraped with a multisig and signed as alice.
```
