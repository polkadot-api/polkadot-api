# Changelog

## Unreleased

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
