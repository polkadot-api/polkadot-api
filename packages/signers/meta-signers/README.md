# @polkadot-api/meta-signers

TxCreator helpers that wrap another TxCreator to submit calls through a meta
account, such as a multisig or proxy account.

The returned TxCreator keeps the original signer's `publicKey` and adds an
`accountId` with the account that will dispatch the wrapped call.

## getMultisigTxCreator

TxCreator that wraps every transaction with a multisig call for the provided
multisig account.

### Usage

```ts
function getMultisigTxCreator<
  Address extends SS58String | HexString,
  T extends TxCreatorFactory<any>,
>(
  multisig: {
    threshold: number
    signatories: Address[]
  },
  getMultisigInfo: (
    multisig: Address,
    callHash: SizedHex<32>,
  ) => Promise<MultisigInfo | undefined>,
  txPaymentInfo: (uxt: Uint8Array, len: number) => Promise<PaymentInfo>,
  txCreator: T & { publicKey: Uint8Array; accountId?: Uint8Array },
  options?: {
    method: (
      approvals: Array<Address>,
      threshold: number,
    ) => "as_multi" | "approve_as_multi"
  },
): T & { publicKey: Uint8Array; accountId: Uint8Array }
```

Create a multisig TxCreator by passing in:

- The multisig information: threshold and signatories.
- A query for existing multisig state, typically
  `typedApi.query.Multisig.Multisigs.getValue`.
- A TxCreator for one of the multisig signatories.

By default:

- If `multisig.threshold === 1`, it uses `Multisig.as_multi_threshold_1`.
- It uses `Multisig.approve_as_multi` until the threshold is reached, then
  `Multisig.as_multi`. Override this with `options.method`.

### Example

```ts
import { getMultisigTxCreator } from "@polkadot-api/meta-signers"
import { Binary } from "polkadot-api"
import {
  connectInjectedExtension,
  getInjectedExtensions,
} from "polkadot-api/pjs-signer"

while (!getInjectedExtensions()?.includes("polkadot-js"))
  await new Promise((res) => setTimeout(res, 50))

const pjs = await connectInjectedExtension("polkadot-js")
const accounts = pjs.getAccounts()
const alice = accounts.find((account) => account.name === "Alice")

if (!alice) throw new Error("Alice account not found")

// ... create a `typedApi` for the chain you want to connect to

const aliceMultisig = getMultisigTxCreator(
  {
    threshold: 2,
    signatories: [
      "15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5",
      "12Ds7U7t2biJXnRY4jWvBu71UzvPMAr3SxXBm2iHqCFBU4Yx",
      "14u9dEGTLgwwzQ6oMm6bN2mt7xxwEko8qciKw9jg3Uc4pYjA",
    ],
  },
  typedApi.query.Multisig.Multisigs.getValue,
  alice.txCreator,
)

await typedApi.tx.System.remark({
  remark: Binary.fromText("We are all very good friends"),
}).createAndSubmit(aliceMultisig(typedApi), {})
```

## getProxyTxCreator

TxCreator that wraps every transaction with `Proxy.proxy`, so the proxied
account dispatches the wrapped call and the provided TxCreator signs as its
delegate.

### Usage

```ts
function getProxyTxCreator<T extends TxCreatorFactory<any>>(
  proxyParams: {
    real: SS58String | HexString
    type?: { type: string; value?: unknown }
  },
  txCreator: T & { publicKey: Uint8Array },
): T & { publicKey: Uint8Array; accountId: Uint8Array }
```

Create a proxy TxCreator by passing in:

- The real proxied account as SS58 or hex.
- An optional proxy type value for `force_proxy_type`.
- The delegate TxCreator that signs the proxy transaction.

### Example

```ts
import { getProxyTxCreator } from "@polkadot-api/meta-signers"
import { Binary } from "polkadot-api"
import { getDevTxCreator } from "./signer"

// ... create a `typedApi` for the chain you want to connect to

const delegate = getDevTxCreator("//Alice")
const proxy = getProxyTxCreator(
  {
    real: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
    type: { type: "Any" },
  },
  delegate,
)

await typedApi.tx.System.remark({
  remark: Binary.fromText("Sent through proxy"),
}).createAndSubmit(proxy(typedApi), {})
```
