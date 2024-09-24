# @polkadot-api/ledger-signer

## `Buffer` polyfill

Ledger libraries require `Buffer` global to exist in scope. If you are on a NodeJS (or Bun) environment you are good to go. If you are on a browser environment, make sure your bundler exposes it or polyfill it yourself with [`buffer` package](https://www.npmjs.com/package/buffer).

## Usage

An example on how to create and use a `LedgerSigner` could be found in [our repo](https://github.com/polkadot-api/polkadot-api/blob/main/examples/bun/src/ledger.ts). In this case it is in a NodeJS environment but similar code could be used for browser as we will see in the next section.

### Install

In order to consume this library, the consumer has to install both `@polkadot-api/ledger-signer` and a Ledger `Transport`. Feel free to walk through [Ledger documentation](https://developers.ledger.com) if you want to know more. For example, for NodeJS environment `@ledgerhq/hw-transport-node-hid` is used, and in web browsers `@ledgerhq/hw-transport-webhid` or `@ledgerhq/hw-transport-webusb` could be used.

In order to create an instance of `LedgerSigner`, the consumer has to create a Ledger `Transport` and open it. The initial boilerplate for using a Ledger in a NodeJS or browser environment is as follows:

```ts
// use any other transport, we give the node example here
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid"
import { LedgerSigner } from "@polkadot-api/ledger-signer"

// this will take the first available device
const transport = await TransportNodeHid.create()
const ledger = new LedgerSigner(transport)
```

### API

First of all, it is important to mention that the class prevents race conditions, and only sends data to the device when it is free and available to receive data. Then, multiple calls could be sent from the consumer and the library would queue them to avoid clashes.

Let's walk through the different methods available in a `LedgerSigner` instance.

#### `appInfo`

This method will query the device to know the app that the device is running. Let's see an example:

```ts
const info = await ledger.appInfo()
// { appName: "Polkadot", appVersion: "100.0.8" }
```

#### `deviceId`

This method creates a deterministic `number` from the device's seed. It could be useful to ensure that the device that was connected is the same one that was connected in previous sessions of the dApp. This method is cached, and calling it multiple times only triggers data exchange with the device the first time.

```ts
const id = await ledger.deviceId()
// 67518578523
```

#### `getPubkey`

In Polkadot ecosystem, accounts derived using Ledger are identified with two numbers. In PolkadotJS Wallet, for example, are called _Account Index_ and _Address Offset_. Other wallets just offer the option to modify the first one. All the methods that will follow take both numbers as arguments, and the second one is optional and defaults to `0`. The recommendation to derive new addresses is to modify just the first one and sequentially derive addresses, starting from `0`. Let's see an example:

```ts
const first = await ledger.getPubkey(0) // exactly the same as `getPubkey(0, 0)`
const second = await ledger.getPubkey(1) // `getPubkey(1, 0)`
const third = await ledger.getPubkey(2) // `getPubkey(2, 0)`
// ...
```

We only return the pubkey, the address could be created from the pubkey using any `SS58` library (such as `@polkadot-api/substrate-bindings`).

#### `seeAddressInDevice`

This method behaves exactly like the previous one, just returning the pubkey, but allows to show the address on a device screen. In this case, it takes also as argument the `SS58` prefix to encode the address with, since the device shows in the screen both the `SS58`-encoded address and the pubkey.

```ts
// 42 is the ss58 prefix in this case
const first = await ledger.seeAddressInDevice(42, 0) // exactly the same as `seeAddressInDevice(42, 0, 0)`
```

#### `getPolkadotSigner`

This method create a `PolkadotSigner` interface that then could be passed to a `polkadot-api` typedApi to sign transactions with it. It requires some off-chain network information from the consumer that the library cannot get from the metadata, generally found in the chainspec; this requirement is a result of [RFC#0078](https://github.com/polkadot-fellows/RFCs/blob/main/text/0078-merkleized-metadata.md). It also takes the two indices mentioned in the previous sections.

More information about `PolkadotSigner` is found at [our docs](https://papi.how/signers).

```ts
// example for Polkadot
const info = { tokenSymbol: "DOT", decimals: 10 }
const signer = await ledger.getPolkadotSigner(info, 0) // same as `getPolkadotSigner(info, 0, 0)`

// got from a `polkadot-api` client
api.tx.System.remark({
  remark: Binary.fromText("Signed from ledger!"),
}).sign(signer)
```
