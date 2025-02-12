# Changelog

## Unreleased

### Fixed

- Match `ChainDefinition` with descriptors type

## 1.9.0 - 2025-02-06

### Added

- `getOfflineApi` which mainly facilitates the creation of extrinsics while being offline.
- **Codegen:**
  - Add XCM v5 known types
- **Chains:**
  - Add Polkadot coretime chainspec

### Fixed

- Reduce the overhead for accessing the genesis-hash (and other small tweaks)
- Fix potentnial memory leak with sync Observables
- **Codegen:**
  - Remove unused known types
- **Chains:**:
  - Update `lightSyncState`

## 1.8.4 - 2025-01-24

### Fixed

- Fix crash when generating code for some chains.

## 1.8.3 - 2025-01-23

### Fixed

- Add block hash and operation for BlockNotPinned error.
- Fixed fee estimation for chains using metadata v14

## 1.8.2 - 2025-01-13

### Fixed

- Custom-signed-extensions declared as `Option` doesn't have to be reported by the user when creating the transaction.
- **CLI**:
  - Whitelist should be a common option
- **Chains:**:
  - Update `lightSyncState`

## 1.8.1 - 2024-12-20

### Fixed

- Extend compatibility check to non-existant entrypoints

## 1.8.0 - 2024-12-18

### Added

- Storage `watchEntries` API
- **CLI**:
  - Option flag `noDescriptorsPackage` to generate descriptors without installing them as a package.
  - Add version option
- **Chains:**
  - Add Paseo People chain

### Fixed

- **Chains:**:
  - Update `lightSyncState`

## 1.7.9 - 2024-12-17

### Fixed

- `unknown` type on storage queries that have a composite key with the same type.
- Update dependencies.

## 1.7.8 - 2024-12-10

### Fixed

- Update dependencies
- **Smoldot:**
  - Update smoldot to `2.0.34`

## 1.7.7 - 2024-11-22

### Fixed

- Fix incompatible error on storage.getEntries with partial compatibility level.
- Handle storage entries that use opaque hashers.
- **Chains:**
  - Update `lightSyncState`

## 1.7.6 - 2024-11-19

### Fixed

- **Smoldot:**
  - Update smoldot to `2.0.33`

## 1.7.5 - 2024-11-18

### Fixed

- **WS provider:**
  - `followEnhancer` should resend the errored chainHead_v1_follow request
- **Smoldot:**
  - Update smoldot to `2.0.32`
- **Chains:**
  - Update `lightSyncState`

## 1.7.4 - 2024-11-15

### Fixed

- **WS Provider:**
  - Address issues with certain RPC providers where misconfigured middlewares incorrectly trigger errors on `chainHead_v1_follow` requests, even though the client hasn't reached the 2-subscription limit.
- **SM Provider:**
  - Prevent the smoldot provider from entering in an infinite loop when either smoldot or the chain crashes.
- **ink**
  - Add missing metadata `source` type.

## 1.7.3 - 2024-11-08

- Patch dependencies (smoldot)

## 1.7.2 - 2024-11-07

### Fixed

- Patch `@polkadot-api/observable-client` connectable bug
- Update dependencies (smoldot-patched)

## 1.7.1 - 2024-11-06

### Fixed

- Patch `@polkadot-api/observable-client` bug

## 1.7.0 - 2024-11-05

### Added

- New sub-package `polkadot-api/ink` for ink! contracts

### Fixed

- **Known Chains:**
  - Use correct `ss58Format` on Paseo chainspecs
- Update dependencies.

## 1.6.7 - 2024-10-31

### Added

- **WS Provider:**
  - New interface `WsProviderConfig` and and overload which accepts this interface. This config interface allows to setup the desired timeout time at which the WebSocket should retry the connection.

### Fixed

- **WS Provider:**
  - Close socket connection when internal timeout is reached to prevent race-conditions.
  - Close socket connection when switching connections before the previous connection has been established.

## 1.6.6 - 2024-10-31

- Accidental release

## 1.6.5 - 2024-10-29

### Fixed

- Update dependencies (fix `scale-ts`)

## 1.6.4 - 2024-10-24

### Fixed

- Edge-case problem with signed-extensions
- Fix issue with nonce values

## 1.6.3 - 2024-10-24

### Fixed

- `getEstimatedFees` and `getPaymentInfo` work with chains that have "exotic" extrinsics.

- **Signer:**
  - Handle "exotic" extrinsics
- **PJS Signer:**
  - Expose "ethereum" addresses
  - Handle "exotic" extrinsics
- **Chains:**
  - Update `lightSyncState` and some bootnodes

### Added

- Expose `topics` on transaction events.

### Fixed

- Add missing `UnsafeApi` export type

## 1.6.2 - 2024-10-18

### Fixed

- Support chains with `u64` block numbers
- Avoid treating `best` and `finalized` requests as "static" block requests.

## 1.6.1 - 2024-10-16

### Fixed

- **PolkadotSDK compat:**
  - Apply `withNumericIds` in the correct order.

## 1.6.0 - 2024-10-16

### Added

- **PolkadotSDK compat:**
  - Add `withNumericIds` enhancer: it ensures that all the ids that are produced from the client are numbers. This is, obvsiously, [shouldn't be necessary](https://www.jsonrpc.org/specification#request_object). However, some RPC endpoints are not JSON-RPC compliant.
- **PJS Signer:**
  - Ability to pass the DApp name to `connectInjectedExtension`.[791](https://github.com/polkadot-api/polkadot-api/pull/791)

### Fixed

- Properly decode metadata v14 for chains that don't support metadata v15

- **PolkadotSDK compat:**
  - Handle JSON-RPC error message on the `translate` enhancer.

## 1.5.1 - 2024-10-12

### Fixed

- Missing dependency `@polkadot-api/ink-contracts`

## 1.5.0 - 2024-10-11

### Added

- New `FixedSizeBinary` static method `fromAccountId32`
- Better support for chains that have custom signed extensions via the new option `customSignedExtensions` that can be passed into the transaction options.

### Fixed

- Avoid throwing when creating a transaction that has an unknown signed-extension.
- Validate transactions on Runtimes that only support metadata V14.

- **WS Provider:**
  - Export missing types

## 1.4.1 - 2024-10-05

### Fixed

- Add missing `RuntimeToken` export type
- Target ES2022 when bundling

## 1.4.0 - 2024-10-03

### Added

- Add UMD export
- Add `getUnsafeApi`

- **WS Provider:**
  - Introduced support for multiple endpoints. The client now rotates between provided endpoints in case of connection issues.
  - Added two options for introspection on protocol status:
    - Pass a `statusChange` callback when creating the client to receive updates on the connection status.
    - Call the `getStatus` function on the `WsJsonRpcProvider` to retrieve the current status of the protocol layer.

### Changed

- **WS Provider:**
  - The client can now proactively trigger a switch to a different endpoint, giving users more control over which endpoint to use.

### Fixed

- If a connections doesn't open in a timely manner, then the client will try to reconnect with the next endpoint.
- `pjs-signer`: Fix incorrect PJS injected account type
- `chains`: Update `lightSyncState`

- **WS Provider:**
  - Automatic timeout handling: the client will now timeout if the connection to the RPC doesn't open in a timely manner and will attempt to reconnect with the next available RPC endpoint.

## 1.3.3 - 2024-09-24

### Fixed

- `signers`: accept v14 metadata as well

## 1.3.2 - 2024-09-20

### Fixed

- `polkadot-sdk-compat`: ensure that the `fixPrematureBlocks` enhancer also accounts for `prrunedBlockHashes` that are not pinned.

## 1.3.1 - 2024-09-20

### Fixed

- `client`: Expose properly imports from `polkadot-api/ws-provider` and `polkadot-api/smoldot`
- `observableClient`: Handle non-spec-compliant pruned-blocks.
- `observableClient`: Fix small mem-leak when deleting prunned-blocks
- `ws-provider`: Improve logs when there is a transport close/error
- `chains`: Update `lightSyncState`

## 1.3.0 - 2024-09-19

### Added

- `polkadot-sdk-compat`: Add `fixChainSpec` enhancer which addresses [the following issue](https://github.com/paritytech/polkadot-sdk/issues/5539) on the PolkadotSDK node.
- `polkadot-sdk-compat`: Add `fixDescendantValues` enhancer which addresses [the following issue](https://github.com/paritytech/polkadot-sdk/issues/5589) on the PolkadotSDK node.
- `polkadot-sdk-compat`: Add `fixDescendantValues` enhancer which addresses [the following issue](https://github.com/paritytech/polkadot-sdk/issues/5589) on the PolkadotSDK node.
- `polkadot-sdk-compat`: Add `fixPrematureBlocks` enhancer which addresses [the following issue](https://github.com/paritytech/polkadot-sdk/issues/5761) on the PolkadotSDK node.
- `client`: Export `CompatibilityToken` type

### Fixed

- codegen: reduced startup memory usage due to esbuild issue [#711](https://github.com/polkadot-api/polkadot-api/pull/711)
- `polkadot-sdk-compat`: Fix small bug with the unpin-hash enhancer
- `json-rpc-proxy`: Added a property to identify internal "stop" events.
- `ws-provider`: Some logs when there is a transport close/error

## 1.2.1 - 2024-09-10

### Fixed

- `codegen`: Remove unused error descriptors
- `codegen`: Resolve errors with a fine-grained approach in the whitelist
- `compatibility`: Resolve properly enum types
- `client`: Throw an error when entrypoint is not found

## 1.2.0 - 2024-09-04

### Added

- New `Binary` methods for supporting "`opaque`" binary data. [#675](https://github.com/polkadot-api/polkadot-api/pull/675).
- `polkadot-api/logs-provider`: new optional `speed` parameter that can be used to accelerate the timing of the logs reproduction.
- polkadot-sdk-compat: add `fixUnorderedBlocks` enhancer which addresses [the following issue](https://github.com/paritytech/polkadot-sdk/issues/5512) on the PolkadotSDK node.
- Add `txFromCallData` API

### Changed

- codegen: Replace chain call data types for broader `TxCallData` [#687](https://github.com/polkadot-api/polkadot-api/pull/687).

### Fixed

- `pjs-signer`: Remove option byte from `CheckMetadataHash`
- Avoid unexpected behaviour with `dispatchError` type
- `chains`: Update `lightSyncState`

## 1.1.0 - 2024-08-28

### Added

- `chains`: Add Encointer Kusama as known chain

### Changed

- Updated checksums of known-types [#667](https://github.com/polkadot-api/polkadot-api/pull/667)

### Fixed

- `pjs-signer`: Allow creating transactions with `CheckMetadataHash` enabled
- `chains`: Update `lightSyncState`

## 1.0.2 - 2024-08-26

### Fixed

- Fix unexpected `BlockNotPinnedError` which happened in occassions after signing.
- `chains`: Fix Paseo AssetHub chainspec
- Remove cli warning when generating descriptors.
- Flush vite dependency cache after generating descriptors.

## 1.0.1 - 2024-08-16

### Fixed

- Fixes [#632](https://github.com/polkadot-api/polkadot-api/issues/632): rare race-condition when following a submitted transaction, which caused a runtime error. [#638](https://github.com/polkadot-api/polkadot-api/pull/638)
- `smoldot`: Update smoldot to `2.0.30`

## 1.0.0 - 2024-08-15

### Fixed

🎉 Release V1 🎉

## 0.13.2 - 2024-08-12

### Fixed

- `polkadot-api/smoldot/node-worker`: unable to add chains with potentialRelayChains.

## 0.13.1 - 2024-08-12

### Fixed

- Update dependencies

## 0.13.0 - 2024-08-12

### Added

- `polkadot-api/smoldot/node-worker` to create a smoldot worker in NodeJS.
- `polkadot-api/smoldot/from-node-worker` to create a client from a node smoldot worker.
- Add people chains for Kusama, Roccoco and Westend [#617](https://github.com/polkadot-api/polkadot-api/pull/617)

### Changed

- `ws-provider`: rename `WebSocketProvider` => `getWsProvider`
- `polkadot-sdk-compat`: replace default export with `withPolkadotSdkCompat`
- Decode `ModuleError` from transactions `DispatchError` [#615](https://github.com/polkadot-api/polkadot-api/pull/615).

### Fixed

- Descriptors entry points when transaction and events have the same checksum.
- Fixed correct ESM export for React Native.
- `chains`: Update `lightSyncState`

## 0.12.1 - 2024-07-30

### Fixed

- `client`: optional arguments logic in `apis` and `query` [#600](https://github.com/polkadot-api/polkadot-api/pull/600).
- `cli`: Yarn berry immutable installation from a clean install [#598](https://github.com/polkadot-api/polkadot-api/pull/598).
- `cli`: Package manager detection with monorepo/workspace projects [#604](https://github.com/polkadot-api/polkadot-api/pull/604).
- `cli`: update command runs codegen two times when called [#602](https://github.com/polkadot-api/polkadot-api/pull/602).

## 0.12.0 - 2024-07-25

### Added

- `InvalidTxError`: a new Error with all the information needed to determine what
  was the reason why the transaction is invlid. Its typings can be obtained via the `TransactionValidityError` type [#589](https://github.com/polkadot-api/polkadot-api/pull/589).
- `client`: Add `isCompatible(threshold: CompatibilityLevel, token?: CompatibilityToken)` to every interaction.
- `chains`: Add Polkadot People and Paseo AssetHub

### Changed

- `cli`: Commands `add`, `remove` and `update` run codegen by default after finishing [#577](https://github.com/polkadot-api/polkadot-api/pull/577).
- `cli`: Move descriptors package out from `node_modules` [#587](https://github.com/polkadot-api/polkadot-api/pull/587).

### Fixed

- `typedApi` not being assignable to union of multiple chains.
- `descriptors`: Whitelist entry for runtime apis
- `chains`: Update bootnodes

### Removed

- `client`: Clean up leaked types from functions `createTxEntry`, `submit`, and `submit$`.

## 0.11.2 - 2024-07-19

### Fixed

- `polkadot-sdk-compat`: Re-export properly default export
- `descriptors`: Whitelist entry for pallet wildcard

## 0.11.1 - 2024-07-18

### Fixed

- Re-export `polkadot-sdk-compat` from the top-level package.

## 0.11.0 - 2024-07-18

### Breaking

- Replaced `isCompatible()` functions for `getCompatibilityLevel()`, for a more granular control of runtime upgrades [#561](https://github.com/polkadot-api/polkadot-api/pull/561)
- Replaced `typedApi.runtime.latest()` for `typedApi.compatibilityToken` [#569](https://github.com/polkadot-api/polkadot-api/pull/569)

### Added

- `chains`: Add Paseo testnet

### Fixed

- `cli`: Allow using `add -c` for parachain chainSpecs of well-known relay-chains [#568](https://github.com/polkadot-api/polkadot-api/pull/568)
- `chains`: Update `lightSyncState` and `bootnodes`

### Fixed

- Changed build to show individual files on source map explorers [#567](https://github.com/polkadot-api/polkadot-api/pull/567)

## 0.10.0 - 2024-07-11

### Added

- re-export `getSs58AddressInfo` from `@polkadot-api/substrate-bindings`

### Changed

- `polkadot-signer`: Add API to sign raw-data and rename `sign` to `signTx`

## 0.9.1 - 2024-07-03

### Fixed

- `codegen`: Remove redundant checksums [#547](https://github.com/polkadot-api/polkadot-api/pull/547)
- `pjs-signer`: Allow wallet to modify signed payload through [PJS PR](https://github.com/polkadot-js/api/pull/5920) [#551](https://github.com/polkadot-api/polkadot-api/pull/551)
- update dependencies

## 0.9.0 - 2024-06-17

### Added

- `client`: Add `blockNumber` to `TxEvents` payload [#530](https://github.com/polkadot-api/polkadot-api/pull/530)

### Fixed

- `chains`: Update `lightSyncState` and `bootnodes` [#535](https://github.com/polkadot-api/polkadot-api/pull/535)
- `smoldot`: Bump to `smoldot@2.0.29`

## 0.8.0 - 2024-05-30

### Added

- `cli`: Add support to add chain using runtime WASM [#517](https://github.com/polkadot-api/polkadot-api/pull/517)
- `client`: Add support to `CheckMetadataHash` signed extension [#526](https://github.com/polkadot-api/polkadot-api/pull/526)

### Changed

- Compact the data when generating descriptor from multiple chains [#516](https://github.com/polkadot-api/polkadot-api/pull/516)

### Fixed

- `chains`: Update `lightSyncState` and `bootnodes` [#524](https://github.com/polkadot-api/polkadot-api/pull/524)
- `smoldot`: Bump to `smoldot@2.0.28`

## 0.7.2 - 2024-05-11

- `chains`: update relay-chain chainSpecs

## 0.7.1 - 2024-05-11

- `cli`: Update metadata files in parallel and perform a single `generate` afterwords.

## 0.7.0 - 2024-05-10

### Added

- The `client` now exposes a `_request` method, which is meant as an "escape hatch"
  to allow the consumers of the JSON-RPC provider have access to debugging endpoints
  such as `system_version`, and other useful endpoints that are not spec compliant.
- Suppot for "optimistic" transactions via the `at` option when creating/broadcasting
  transactions. This makes it possible to create transactions against blocks that are
  not yet finalized. [#486](https://github.com/polkadot-api/polkadot-api/pull/486)
- Allow users to manually pass the `nonce` when creating a transaction. [#498](https://github.com/polkadot-api/polkadot-api/pull/498)
- Decouple descriptor types from descriptor values: Now operations won't show empty pallets.
- Lazy load descriptor values

### Changed

- The payload of the transaction `bestChainBlockIncluded` event is now consistent with the payload of the `finalized` event. [#500](https://github.com/polkadot-api/polkadot-api/pull/500)
- Improve transaction events and return payloads as described in [#497](https://github.com/polkadot-api/polkadot-api/issues/497#issuecomment-2101197782). [#507](https://github.com/polkadot-api/polkadot-api/pull/507#issue-2289908187)

### Fixed

- `substrate-client`: improve the cancelation logic on operations that have not yet received its operationId [#484](https://github.com/polkadot-api/polkadot-api/pull/484)
- `observable-client`: ensure `bestBlocks$` always start with latest known `finalizedBlock` [#491](https://github.com/polkadot-api/polkadot-api/pull/491)
- Stop-recovery: blocks from previous session getting unpinned
- `observable-client`: `operationLimit`-recovery: properly recover from `operationLimit` responses [#494](https://github.com/polkadot-api/polkadot-api/pull/494)
  Closes [#492](https://github.com/polkadot-api/polkadot-api/issues/492)
- Recover from stop events when runtime hasn't loaded and finalized block changes
- `pjs-signer`: Ensure SignerPayloadJSON to be the same as PJS api
- Keeps on validating transactions after they have been broadcasted. [#500](https://github.com/polkadot-api/polkadot-api/pull/500)
- `smoldot`: Upgraded to `smoldot@2.0.26`

## 0.6.0 - 2024-05-03

### Breaking

- `client`: rename `watchBlockBlody` to `watchBlockBody`
- `getEstimatedFee` takes as input the sender's address and optionally the "hinted-sign-extensions"
- `tx`: now transactions are mortal by default with a 64 blocks period
- `codegen`: [deduplicate equivalent known types](https://github.com/polkadot-api/polkadot-api/pull/448)
- Move the `is` and `as` methods from enum values to `Enum`: `Enum.is(value, tag)`, `Enum.as(value, tag)`.

### Changed

- performance optimization: avoid creating a storage operation on `System.Number` storage entry.

### Fixed

- properly export `FixedSizeBinary` (only the type was being exported).
- json-rpc-proxy: Ensure that the proxy works with all the known versions of the JSON-RPC spec
- `cli/codegen`: `Anonymize` is now able to properly distinguish `Binary` types,
  which were previously being anonymized as`FixedSizeBinary<number>`
- `getEstimatedFee` now uses the more comon runtime-call: `TransactionPaymentApi_query_info`
- `pjs-signer`: Ensure blockNumber in SignerPayloadJSON

## 0.5.5 - 2024-04-29

### Fixed

- @polkadot-api/smoldot: Upgraded to `smoldot@2.0.25`

## 0.5.4 - 2024-04-27

### Fixed

- `polkadot-signer`: ignore unsupported account types
- `chains`: fixed rococo-asset-hub chainSpec

## 0.5.3 - 2024-04-26

### Fixed

- `pjs-signer`: [SignerPayloadJSON type mismatch - #499](https://github.com/polkadot-api/polkadot-api/issues/449).
- Correct types of hinted-sign-extensions on transactions.

## 0.5.2 - 2024-04-25

### Fixed

- Fixed types of `transaction['decodedCall']`

## 0.5.1 - 2024-04-25

### Fixed

- update `@polkadot-api/codegen`
- fixed: compatibility enhancer

## 0.5.0 - 2024-04-25

### Breaking

- The generic for `Enum<T>` is now an object of `{ [type: string]: any }`, rather than a union of `{ type: string, value: any } | ... | { type: string, value: any }`

### Added

- `getChainSpecData: () => Promise<{name: string, genesisHash: string, properties: any}>`.
- New type `EnumVariant<T, K>` to select one specific variant from an enum.
- Improved Enum type inference so that they can be assigned between types as long as they are compatible.

### Fixed

- substrate-client: Improve the compatibility handling with the different versions of the JSON-RPC methods.
- Upgraded to `smoldot@2.0.24`

## 0.4.0 - 2024-04-23

### Added

- Support for metadata V14

## 0.3.0 - 2024-04-22

### Added

- Added support for `AccountId20`
- cli: Specify a whitelist file through `generate --whitelist filename` command.

## 0.2.4 - 2024-04-15

### Fixed

- substrate-client: `operationWaitingForContinue` response was missing the `operationId`

### Fixed

- client: uncaught storage exception with incompatible runtime.

## 0.2.3 - 2024-04-15

### Fixed

- client: Improve `watchValue` performance (using new `raceMap` operator)

## 0.2.2 - 2024-04-15

### Fixed

- well-known-chains: Updated `lightSyncState` of relay-chain chainSpecs

## 0.2.1 - 2024-04-15

### Fixed

- well-known-chains: removded `ws` bootnodes

## 0.2.0 - 2024-04-14

### Added

- `getEstimatedFees` API to make it easier to query the fees of a given transaction.

## 0.1.3 - 2024-04-12

### Fixed

- logs-provider: [Support logs with transactions](https://github.com/polkadot-api/polkadot-api/pull/414)
- observable-client: [Tx with competing forks problem](https://github.com/polkadot-api/polkadot-api/pull/415)

## 0.1.2 - 2024-04-11

### Fixed

- CLI: remove the descriptors folder if it exists before attempting to create it.

## 0.1.1 - 2024-04-11

### Fixed

- CLI: check if the descriptors folder exists before attempting to create the folder.

## 0.1.0 - 2024-04-11

### Changed

Initial release
