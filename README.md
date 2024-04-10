# polkadot-api

## Features

- Light client first: built on top of the [new JSON-RPC spec](https://paritytech.github.io/json-rpc-interface-spec/) to fully leverage the potential of light-clients (i.e: [smoldot](https://www.npmjs.com/package/smoldot)).
- Delightful TypeScript support with types and docs generated from on-chain metadata.
- First class support for storage reads, constants, transactions, events and runtime-calls.
- Performant and light-weight: ships with multiple sub-paths, so that dApp doesn't bundle unnecessary assets.
- Browser native [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt), instead of large BigNumber libraries
- Leverages dynamic imports to favour faster loading times.
- Promise-based and Observable-based APIs: use the one that best suit your needs and/or coding style.
- Use signers from your browser extension, or from a private key.
- Easy integration with PJS-based extensions.

... and a lot lot more.

## Overview

#### `smoldot.ts`

```ts
import { startFromWorker } from "polkadot-api/smoldot/from-worker"
import SmWorker from "polkadot-api/smoldot/worker?worker"

// Let's start smoldot on a Worker
export const smoldot = startFromWorker(new SmWorker())

// Alternatively you could have smoldot running on the main-thread, e.g:
// import { start } from "polkadot-api/smoldot"
// export const smoldot = start()
```

#### `main.ts`

```ts
import { createClient } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider"
import { polkadotTypes } from "@polkadot-api/descriptors"
import { smoldot } from "./smoldot"

// dynamically importing the chainSpec improves the performance of your dApp
const smoldotRelayChain = import("polkadot-api/chains/polkadot").then(
  ({ chainSpec }) => smoldot.addChain({ chainSpec }),
)

// let's create a `JsonRpcProvider` from a `smoldot` chain.
const jsonRpcProvider = getSmProvider(smoldotRelayChain)

// we could also create a `JsonRpcProvider` from a WS connection, eg:
// const jsonRpcProvider = WsProvider("wss://some-rpc-endpoint.io")

const polkadotClient = createClient(jsonRpcProvider)

polkadotClient.subscribe((block) => {
  console.log(`#${block.number} - ${block.hash} - parentHash: ${block.parent}`)
})

const polkadotApi = polkadotClient.getTypedApi(polkadotTypes)

const {
  data: { free, frozen },
} = await polkadotApi.query.System.Account.getValue(
  "15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5",
)

console.log(`Transferrable amount: ${free - frozen}`)
```

## Documentation

Comming **very** soon!

## Announcement: Transfer of Ownership

As of 2024-02-01, the original owner and maintainer of the Polkadot-API project, Parity Technologies, has officially transferred ownership of the project to me, Josep M Sobrepere. Read more about this transfer [here](NEWS.md#announcement-transfer-of-ownership).
