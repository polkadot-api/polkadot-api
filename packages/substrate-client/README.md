# @polkadot-api/substrate-client

Low-level package with typescript bindings to the [Substrate JSON-RPC Interface](https://paritytech.github.io/json-rpc-interface-spec/introduction.html)

## Usage

This package starts creating a `SubstrateClient` object. To create one, you need a `ConnectProvider` from [@polkadot-api/json-rpc-provider](https://github.com/polkadot-api/polkadot-api/tree/main/packages/json-rpc-provider) that performs the connection to a specific blockchain client.

For example, you can use [@polkadot-api/sc-provider](https://github.com/polkadot-api/polkadot-api/tree/main/packages/sc-provider) to create a substrate-connect provider to connect to the Polkadot relay chain through a light client:

```ts
import { getScProvider, WellKnownChain } from "@polkadot-api/sc-provider"
import { createClient } from "@polkadot-api/substrate-client"

const scProvider = getScProvider()
const { relayChain } = scProvider(WellKnownChain.polkadot)

const client = createClient(relayChain)
```

### Request

Any method defined in the [JSON-RPC Spec](https://paritytech.github.io/json-rpc-interface-spec/introduction.html) can be called with `client.request(method, params, abortSignal?)`. This returns a promise that will resolve with the response from the JSON-RPC server.

```ts
const genesisHash = await client.request("chainSpec_v1_genesisHash", [])
```

All the functions that return a promise accept an [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) as a means of cancelling the operation.

### ChainHead

As the operations within the [`chainHead` group of functions](https://paritytech.github.io/json-rpc-interface-spec/api/chainHead.html) deal with subscriptions and interdependencies between methods, this package provides an abstraction creating a simpler way to interface with them.

Calling `client.chainHead(withRuntime, onFollowEvent, onFollowError)` will start a `chainHead_unstable_follow` subscription, and will return a handle to perform operations with the chainHead.

```ts
const chainHead = client.chainHead(
  true,
  (event) => {
    // ...
  },
  (error) => {
    // ...
  },
)
```

The handle contains one function per each of the methods defined inside `chainHead` except for the ones that deal with subscription (meaning it has `body`, `call`, `header`, `storage`, and `unpin`).

The JSON-RPC Spec for chainHead specifies that these methods return an `operationId`, and that the resolved response for the call will come through the `chainHead_unstable_follow` subscription, linking it through this `operationId`.

**`substrate-client`'s chainHead is an abstraction over this**: The events emitted through the `client.chainHead()` call are only the ones initiated from the JSON-RPC Server. Any event generated from one of the `chainHead`'s handle calls, will instead be emitted through the promise returned by them.

```ts
const chainHead = client.chainHead(
  true,
  async (event) => {
    if (event.type === "newBlock") {
      const body = await chainHead.body(event.blockHash)
      // body is a string[] containing the SCALE-encoded values within the body
      processBody(body)

      chainHead.unpin([event.blockHash])
    }
  },
  (error) => {
    // ...
  },
)
```

To close the subscription, call `chainHead.unfollow()`.

#### storageSubscription

For consistency, `chainHead.storage(hash, type, key, childTrie)` returns a Promise that will resolve with the value returned by the JSON-RPC server for that `key`.

However, the JSON-RPC Spec defines that it should be possible to pass multiple items to be resolved at once. For this case, substrate-client also offers a lower-level version called `chainHead.storageSubscription(hash, inputs, childTrie, onItems, onError, onDone, onDiscardedItems)` that will emit the storage items as they are getting resolved by the JSON-RPC server:

```ts
chainHead.storageSubscription(
  hash,
  [{ key: "key", type: "value" }],
  null,
  (items) => {
    // ...
  },
  (error) => {
    // ...
  },
  () => {
    // done
  },
  (nDiscardedItems) => {
    // ...
  },
)
```

### Transaction

Similarly, [`transaction` group of functions](https://paritytech.github.io/json-rpc-interface-spec/api/transaction.html) also deal with subscriptions through `submitAndWatch`, so SubstrateClient also abstracts over this:

```ts
const cancelRequest = client.transaction(
  transaction,
  (event) => {
    // ...
  },
  (error) => {
    // ...
  },
)

// call `cancelRequest()` to abort the transaction (`transaction_unstable_stop`)
```

### Destroy

Call `client.destroy()` to disconnect from the provider.
