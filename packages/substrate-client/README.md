# @polkadot-api/substrate-client

This TypeScript package provides low-level bindings to the [Substrate JSON-RPC Interface](https://paritytech.github.io/json-rpc-interface-spec/introduction.html), enabling interaction with Substrate-based blockchains.

## Usage

This package starts creating a `SubstrateClient` object. To create one, you need a provider defined as `ConnectProvider` from [@polkadot-api/json-rpc-provider](https://github.com/polkadot-api/polkadot-api/tree/main/packages/json-rpc-provider) for establishing a connection to a specific blockchain client.

For instance, use [@polkadot-api/sc-provider](https://github.com/polkadot-api/polkadot-api/tree/main/packages/sc-provider) to create a substrate-connect provider for connecting to the Polkadot relay chain through a light client:

```ts
import { getScProvider, WellKnownChain } from "@polkadot-api/sc-provider"
import { createClient } from "@polkadot-api/substrate-client"

const scProvider = getScProvider()
const { relayChain } = scProvider(WellKnownChain.polkadot)

const client = createClient(relayChain)
```

### Request

Invoke any method defined in the [JSON-RPC Spec](https://paritytech.github.io/json-rpc-interface-spec/introduction.html) using `client.request(method, params, abortSignal?)`. This returns a promise resolving with the response from the JSON-RPC server.

```ts
const genesisHash = await client.request("chainSpec_v1_genesisHash", [])
```

All promise-returning functions exported by this package accept an [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) for operation cancellation.

### ChainHead

Operations within the [`chainHead` group of functions](https://paritytech.github.io/json-rpc-interface-spec/api/chainHead.html) involve subscriptions and interdependencies between methods. The client has a function that simplifies the interaction with these group.

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

The handle provides one method per each of the functions defined inside `chainHead`: `chainHead_unstable_body`, `chainHead_unstable_call`, `chainHead_unstable_header`, `chainHead_unstable_storage`, and `chainHead_unstable_unpin`.

The JSON-RPC Spec for chainHead specifies that these functions return an `operationId`, and that the resolved response for the call will come through the `chainHead_unstable_follow` subscription, linking it through this `operationId`.

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

For consistency, `chainHead.storage(hash, type, key, childTrie)` returns a Promise resolving with the value returned by the JSON-RPC server.

However, the JSON-RPC Spec defines that it should be possible to pass multiple items to be resolved at once. For this case, substrate-client also offers a lower-level version called `chainHead.storageSubscription(hash, inputs, childTrie, onItems, onError, onDone, onDiscardedItems)` that emits the storage items as they get resolved by the JSON-RPC server:

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

[`transaction` group of functions](https://paritytech.github.io/json-rpc-interface-spec/api/transaction.html) also deals with subscriptions through `submitAndWatch`. SubstrateClient also abstracts over this:

```ts
const cancelRequest = client.transaction(
  transaction, // SCALE-encoded transaction
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
