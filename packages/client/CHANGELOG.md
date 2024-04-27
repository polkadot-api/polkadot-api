# Changelog

## Unreleased

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
