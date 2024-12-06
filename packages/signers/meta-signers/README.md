# @polkadot-api/meta-signers

## getMultisigSigner

Signer that wraps every transaction with a `Multisig.as_multi` for the provided multisig.

### Usage

```ts
function getMultisigSigner(
  multisig: {
    threshold: number
    signatories: SS58String[]
  },
  getMultisigInfo: (
    multisig: SS58String,
    callHash: Binary,
  ) => Promise<MultisigInfo | undefined>,
  txPaymentInfo: (uxt: Binary, len: number) => Promise<PaymentInfo | undefined>,
  signer: PolkadotSigner,
): PolkadotSigner
```

Create a multisig signer by passing in:

- The multisig information (threshold and list of signatories)
- A call to query an existing multisig call (`typedApi.query.Multisig.Multisigs`)
- A call to get the call payment info (`testApi.apis.TransactionPaymentApi.query_info`)
- A signer of one the signatories.

### Example

```ts
import { getMultisigSigner } from "@polkadot-api/meta-signers"
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

// ... create a `typedApi` to the chain you want to connect to

// Create a multisig signer with alice
const aliceMultisig = getMultisigSigner(
  {
    threshold: 2,
    signatories: [
      "15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5",
      "12Ds7U7t2biJXnRY4jWvBu71UzvPMAr3SxXBm2iHqCFBU4Yx",
      "14u9dEGTLgwwzQ6oMm6bN2mt7xxwEko8qciKw9jg3Uc4pYjA",
    ],
  },
  typedApi.query.Multisig.Multisigs,
  typedApi.apis.TransactionPaymentApi.query_info,
  alice.signer,
)

// Send the transaction as multisig
await typedApi.tx.System.remark({
  remark: Binary.fromText("We are all very good friends"),
}).signAndSubmit(aliceMultisig)

// The transaction will be wraped with a multisig and signed as alice.
```
