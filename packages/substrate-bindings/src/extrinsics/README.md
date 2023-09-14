As defined in the [Polkadot Spec](https://spec.polkadot.network/id-extrinsics), an extrinsic is a [SCALE](https://docs.substrate.io/reference/scale-codec/) encoded vector.

A SCALE encoded vector is prefixed with a `compact` encoding of the number of items.

The encoded extrinsic bytes to be sent over RPC with `author_submitExtrinsic` can be encoded with [`scale-ts`](https://www.npmjs.com/package/scale-ts) as follows

```js
const opaqueExtrinsic = Bytes().enc(extrinsic)
```

# How to decode an extrinsic?

An extrinsic has the following shape

- 1-byte `u8` encoding the body version and if the body is signed
- Body, for `v4`
  - `MultiAddress` enum, 1-byte index variant and 32-byte sender address for `AccountId32` variant
  - `MultiSignature` enum, 1-byte index variant and 64-byte signature (or 65-byte for Ecdsa variant)
  - extra data
    - `u16` mortality
    - `compact` nonce
    - `compact` tip
  - call
    - `u8` module index
    - `u8` function index
    - n-byte function arguments

With `scale-ts`

```js
const $version = enhanceCodec(
  u8,
  (value) => (+!!value.signed << 7) | value.version,
  (value) => ({
    version: value & ~(1 << 7),
    signed: !!(value & (1 << 7)),
  }),
)
const $multiAddress = Enum({
  0: Bytes(32),
  // FIXME: complete MultiAddress variants
})
const $multiSignature = Enum({
  0: Bytes(64), // Ed25519
  1: Bytes(64), // Sr25519
  2: Bytes(65), // Ecdsa
})
const $mortal = enhanceCodec(
  Bytes(2),
  (value) => {
    const factor = Math.max(value.period >> 12, 1)
    const left = Math.min(Math.max(trailingZeroes(value.period) - 1, 1), 15)
    const right = (value.phase / factor) << 4
    return u16.enc(left | right)
  },
  (value) => {
    const enc = u16.dec(value)
    const period = 2 << enc % (1 << 4)
    const factor = Math.max(period >> 12, 1)
    const phase = (enc >> 4) * factor
    return { type: "mortal", period, phase }
  },
)
const $mortality = createCodec(
  (value) => (value.type === "inmortal" ? u8.enc(0) : $mortal.enc(value)),
  createDecoder((value) => {
    const firstByte = u8.dec(value)
    if (firstByte === 0) return { type: "inmortal" }
    const secondByte = u8.dec(value)
    console.log({ firstByte, secondByte })
    return $mortal.dec(Uint8Array.from([firstByte, secondByte]))
  }),
)
const $extra = Struct({
  mortality: $mortality,
  nonce: compact,
  tip: compact,
})
const $call = Struct({
  module: u8,
  method: u8,
  // for a balances.transferKeepAlive(dest, value) arguments
  args: Struct({
    dest: $multiAddress,
    value: compact,
  }),
})
const $extrinsic = Struct({
  version: $version,
  // v4 Body
  body: Struct({
    sender: $multiAddress,
    signature: $multiSignature,
    extra: $extra,
    call: $call,
  }),
})
const $opaqueExtrinsic = enhanceCodec(Bytes(), $extrinsic.enc, $extrinsic.dec)
const extrinsic = $opaqueExtrinsic.dec("0x...")

console.log(extrinsic)
```

## Body sender

In Polkadot, the `sender` is an enum where the 1st variant is a 32-byte `AccountId`.

```js
const $multiAddress = Enum({
  0: Bytes(32),
  // other variants: Index, Raw, Address32, Addres20
})
```

For the other variants check [Substrate](https://github.com/paritytech/substrate/blob/763d77cc483f88952b19735d15de4b73c3a02f2d/primitives/runtime/src/multiaddress.rs#L23-L37).

## Body call

The `call` encodes the module index, the method index and the method arguments.

For example, to encode a `balances.transferKeepAlive(dest, value)` with `scale-ts`

```js
$call.enc({
  module: 4,
  method: 3,
  args: {
    dest: {
      // MultiAddress.Id
      tag: 0,
      value: new Uint8Array(32),
    },
    value: 1000000000000n,
  },
})
```

## Body extra

In Polkadot, the `extra` encodes mortality, nonce and tip.

```js
const $extra = Struct({
  mortality: $mortality,
  nonce: compact,
  tip: compact,
})
```

The extrinsic mortality is a mechanism which ensures that an extrinsic is only valid within a certain period. It could be 1-byte for inmortal and 2-byte for mortal extrinsics.
Mortal extrinsics encode 2 values

- `period`, which should be a power of `2` and greater or equal to `4`
- `phase`, which is equal to `blockNumber mod period`, where `blockNumber` is when the `period` of validity starts

For more details check the [Polkadot Spec](https://spec.polkadot.network/id-extrinsics#id-mortality).

## Body signature

The [`MultiSignature`](https://github.com/paritytech/substrate/blob/51b2f0ed6af8dd4facb18f1a489e192fd0673f7b/primitives/runtime/src/lib.rs#L239-L249) is an enum with the signature `type` used to sign the `signature payload`.

The `signature` is computed by encoding the `signature payload` as follows

```js
const $signaturePayload = Struct({
  call: $call,
  extra: $extra,
  specVersion: u32,
  transactionVersion: u32,
  genesisHash: Bytes(32),
  blockHash: Bytes(32),
});
const signaturePayloadEncoder = (signaturePayload) => {
  const encoded = $signaturePayload.enc(signaturePayload);
  return encoded.length > 256 ? blake2b(encoded) : encoded;
};
const signaturePayload = signaturePayloadEncoder({
  call: { ... },
  extra: { ... },
  specVersion: 9430, // metadata const system.version.specVersion
  transactionVersion: 22, // metadata const system.version.transactionVersion
  genesisHash: Bytes(32).dec("0x..."), // RPC -> chain_getBlockHash(0)
  blockHash: Bytes(32).dec("0x..."), // RPC -> chain_getFinalizedHead()
});

// using PolkadotJS or similar
const keyring = new Keyring({ ss58Format: 42, type: "sr25519" });
const pair = keyring.getPair("address")
const signature = pair.sign(signaturePayload);
```

# How to encode an extrinsic?

With the previous codecs, a `balances.transferKeepAlive(...)` extrinsic valid from block number `16710496` could be created as follows

```js
const blockNumber = 16710496;
const period = 64;
const extra = {
  mortality: { type: "mortal", period, phase: blockNumber % period },
  nonce,
  tip: 0,
};
const call = {
  module: 4,
  method: 3,
  args: {
    dest: {
      tag: 0,
      value: new Uint8Array(32),
    },
    value: 1000000000000n,
  },
};
const signaturePayload = signaturePayloadEncoder({ call, extra, ... });
const signature = pair.sign(signaturePayload);
const extrinsic = $opaqueExtrinsic.enc({
  version: {
    signed: true,
    version: 4,
  },
  body: {
    sender: { tag: "0", value: pair.publicKey },
    signature: { tag: "1", value: signature },
    extra,
    call,
  },
});
```

# Creating extrinsics for any Substrate chain

In Substrate, an [`UncheckedExtrinsic`](https://github.com/paritytech/substrate/blob/51b2f0ed6af8dd4facb18f1a489e192fd0673f7b/primitives/runtime/src/generic/unchecked_extrinsic.rs#L43-L57) is generic over `Address`, `Call`, `Signature` and `Extra`.

The concrete types to create the codecs for an `UncheckedExtrinsic` are chain specific and described in the chain [metadata](https://spec.polkadot.network/sect-metadata#sect-rtm-extrinsic-metadata).

This is important because different Substrate chains may have different extrinsic shapes.
For example, the `UncheckedExtrinsic` in Polkadot and AssetHub are slightly different when it comes to tips.
In Polkadot, tips are paid with the native asset; and, in AssetHub, tips can be paid in the native asset or with another asset.
For more details check

- Polkadot [`UncheckedExtrinsic`](https://github.com/paritytech/polkadot/blob/7458cbda04aecb672a65be99e2a57e1724dca10c/runtime/polkadot/src/lib.rs#L1522-L1524) [`SignedExtra`](https://github.com/paritytech/polkadot/blob/7458cbda04aecb672a65be99e2a57e1724dca10c/runtime/polkadot/src/lib.rs#L1461-L1472) [`ChargeTransactionPayment`](https://github.com/paritytech/substrate/blob/51b2f0ed6af8dd4facb18f1a489e192fd0673f7b/frame/transaction-payment/src/lib.rs#L665-L677)
- AssetHub [`UncheckedExtrinsic`](https://github.com/paritytech/cumulus/blob/ee9e7cd96b7b69f7491161006a066062e7007f15/parachains/runtimes/assets/asset-hub-polkadot/src/lib.rs#L786-L788) [`SignedExtra`](https://github.com/paritytech/cumulus/blob/ee9e7cd96b7b69f7491161006a066062e7007f15/parachains/runtimes/assets/asset-hub-polkadot/src/lib.rs#L775-L785) [`ChargeAssetTxPayment`](https://github.com/paritytech/substrate/blob/51b2f0ed6af8dd4facb18f1a489e192fd0673f7b/frame/transaction-payment/asset-tx-payment/src/lib.rs#L143-L154)

# Using a light client to send an Extrinsic

An extrinsic can be sent using [Smoldot](https://github.com/smol-dot/smoldot) which is a light client implementation.

At the time of writing, Smoldot is implementing a [new JSON RPC API](https://paritytech.github.io/json-rpc-interface-spec/introduction.html) and the call to send an extrinsic is [`transaction_unstable_submitAndWatch`](https://paritytech.github.io/json-rpc-interface-spec/api/transaction_unstable_submitAndWatch.html).

To create an extrinsic, the following data is needed

- `call`, the extrinsic call
- `blockHash`, from any finalized block reported by [`chainHead_unstable_follow`](https://paritytech.github.io/json-rpc-interface-spec/api/chainHead_unstable_follow.html)
- `nonce`, from storage `System.Account(AccountId32)` at a given finalized block
- `blockNumber`, from storage `System.Number` at a given finalized block
- `genesisHash`, from RPC [`chainHead_unstable_genesisHash`](https://paritytech.github.io/json-rpc-interface-spec/api/chainHead_unstable_genesisHash.html)
- `specVersion`, from `finalizedBlockRuntime.specVersion` reported by a `chainHead_unstable_follow` event
- `transactionVersion`, from `finalizedBlockRuntime.transactionVersion` reported by a `chainHead_unstable_follow` event

With the above information, an extrinsic can be encoded as Hex and sent using the RPC [`transaction_unstable_submitAndWatch`](https://paritytech.github.io/json-rpc-interface-spec/api/transaction_unstable_submitAndWatch.html).

This [sample code](https://stackblitz.com/edit/extrinsic-new-json-rpc-api?file=src%2Fmain.ts) implements the extrinsic encoding and RPC calls to submit an extrinsic.

# Accessing Storage

The storage is a key-value database and it can be queried with the [`chainHead_unstable_storage`](https://paritytech.github.io/json-rpc-interface-spec/api/chainHead_unstable_storage.html) RPC.

[`chainHead_unstable_storage`](https://paritytech.github.io/json-rpc-interface-spec/api/chainHead_unstable_storage.html) needs

- a finalized block hash reported by `chainHead_unstable_follow`
- a storage key to query

By following the chain head, finalized block hashes can be tracked and saved to make storage calls.

```ts
let latestFinalizedBlockHash: string
const chainHeadFollower = chainHead(true, (event: any) => {
  if (event.event === "initialized") {
    latestFinalizedBlockHash = event.finalizedBlockHash
  } else if (event.event === "finalized") {
    latestFinalizedBlockHash =
      event.finalizedBlockHashes[event.finalizedBlockHashes.length - 1]
  }
})
```

A storage key is computed by concatenating the following hashes

- the name of the pallet with [TwoX 128 Hash](https://github.com/Cyan4973/xxHash)
- the name of the storage value with [TwoX 128 Hash](https://github.com/Cyan4973/xxHash)
- for storage maps, the map key with the configured [hashing algorithm](https://docs.substrate.io/build/runtime-storage/#common-substrate-hashers)

For more details, see [Substrate Quering Storage](https://docs.substrate.io/learn/state-transitions-and-storage/#querying-storage)

For example, to compute the `System.Number` storage key

```ts
import { twoX128 } from "@polkadot-api/substrate-bindings"
import { mergeUint8, toHex } from "@polkaddot-api/utils"

const systemKey = toHex(twoX128(new TextEncoder().encode("System")))
const numberKey = toHex(twoX128(new TextEncoder().encode("Number")))
const systemNumberKey = toHex(
  mergeUint8(
    twoX128(new TextEncoder().encode("System")),
    twoX128(new TextEncoder().encode("Number")),
  ),
)
console.log({ systemKey, numberKey, systemNumberKey })
// {
//   systemKey: '0x26aa394eea5630e07c48ae0c9558cef7',
//   numberKey: '0x02a5c1b19ab7a04f536c519aca4983ac',
//   systemNumberKey: '0x26aa394eea5630e07c48ae0c9558cef702a5c1b19ab7a04f536c519aca4983ac'
// }
```

For example, to compute the `System.Account(AccountId32)` storage key

```ts
import { blake2b } from "@noble/hashes/blake2b"
import { Keyring } from "@polkadot/keyring"
import { cryptoWaitReady } from "@polkadot/util-crypto"
import { twoX128 } from "@polkadot-api/substrate-bindings"
import { mergeUint8, toHex } from "@polkadot-api/utils"

await cryptoWaitReady()

const keyring = new Keyring({ ss58Format: 42, type: "sr25519" })
const mnemonic =
  "describe excess pig damage elbow audit receive buyer release very category endorse"
const sender = keyring.addFromMnemonic(`${mnemonic}//sender`)
const systemKey = toHex(twoX128(new TextEncoder().encode("System")))
const accountKey = toHex(twoX128(new TextEncoder().encode("Account")))
const accountId32Key = toHex(
  mergeUint8(blake2b(sender.publicKey, { dkLen: 128 / 8 }), sender.publicKey),
)
const systemAccountKey = toHex(
  mergeUint8(
    twoX128(new TextEncoder().encode("System")),
    twoX128(new TextEncoder().encode("Account")),
    blake2b(sender.publicKey, { dkLen: 128 / 8 }),
    sender.publicKey,
  ),
)
console.log({ systemKey, accountKey, accountId32Key, systemAccountKey })
// {
//   systemKey: '0x26aa394eea5630e07c48ae0c9558cef7',
//   accountKey: '0xb99d880ec681799c0cf30e8886371da9',
//   accountId32Key: '0xf5fefa644d779872e1b0b93e4dee21a922c6592f562829da060afbdd05d82fb9a29266d9d94cb94b86ba5795c8ca986c',
//   systemAccountKey: '0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9f5fefa644d779872e1b0b93e4dee21a922c6592f562829da060afbdd05d82fb9a29266d9d94cb94b86ba5795c8ca986c'
// }
```

Note: the hashing algorithm for `AccountId32` is `Blake2_128Concat`, this is defined in the metadata but it can also be found in the Substrate [System Pallet](https://github.com/paritytech/substrate/blob/51b2f0ed6af8dd4facb18f1a489e192fd0673f7b/frame/system/src/lib.rs#L564-L573)

Then, the response to storage queries can be decoded based on the storage value shape defined in the [metadata](https://spec.polkadot.network/sect-metadata#defn-rtm-pallet-storage-metadata):

- For `System.Number` the value shape is `u32` defined in the Substrate [System Pallet](https://github.com/paritytech/substrate/blob/51b2f0ed6af8dd4facb18f1a489e192fd0673f7b/frame/system/src/lib.rs#L602-L606) where [`BlockNumber`](https://github.com/paritytech/polkadot/blob/7458cbda04aecb672a65be99e2a57e1724dca10c/core-primitives/src/lib.rs#L33-L35) is the concreate value for Polkadot

```ts
u32.dec("0x...")
```

- For `System.Account(AccountId32)` the value shape is `AccountInfo` defined in the Substrate [System Pallet](https://github.com/paritytech/substrate/blob/51b2f0ed6af8dd4facb18f1a489e192fd0673f7b/frame/system/src/lib.rs#L765-L782) where [`AccountIndex`](https://github.com/paritytech/polkadot/blob/7458cbda04aecb672a65be99e2a57e1724dca10c/core-primitives/src/lib.rs#L52-L53) is the concrete value for Polkadot

```ts
Struct({
  nonce: u32,
  consumer: u32,
  providers: u32,
  sufficients: u32,
  data: Bytes(Infinity),
}).dec("0x...")
```
