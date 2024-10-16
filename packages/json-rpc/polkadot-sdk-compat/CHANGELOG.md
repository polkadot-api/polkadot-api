# Changelog

## Unreleased

## 2.3.0 - 2024-10-16

### Added

- Add `withNumericIds` enhancer: it ensures that all the ids that are produced from the client are numbers. This is, obvsiously, [shouldn't be necessary](https://www.jsonrpc.org/specification#request_object). However, some RPC endpoints are not JSON-RPC compliant.

### Fixed

- Handle JSON-RPC error message on the `translate` enhancer.

## 2.2.2 - 2024-10-05

### Fixed

- Target ES2022 when bundling

## 2.2.1 - 2024-09-20

### Fixed

- Fix `fixPrematureBlocks` so that it also accounts for `prrunedBlockHashes` that are not pinned.

## 2.2.0 - 2024-09-19

### Added

- Add `fixChainSpec` enhancer which addresses [the following issue](https://github.com/paritytech/polkadot-sdk/issues/5539) on the PolkadotSDK node.
- Add `fixDescendantValues` enhancer which addresses [the following issue](https://github.com/paritytech/polkadot-sdk/issues/5589) on the PolkadotSDK node.
- Add `fixPrematureBlocks` enhancer which addresses [the following issue](https://github.com/paritytech/polkadot-sdk/issues/5761) on the PolkadotSDK node.

### Fixed

- Fix small bug with the unpin-hash enhancer

## 2.1.0 - 2024-09-04

### Added

- Add `fixUnorderedBlocks` enhancer which addresses [the following issue](https://github.com/paritytech/polkadot-sdk/issues/5512) on the PolkadotSDK node.

## 2.0.0 - 2024-08-12

### Changed

- Replace default export with named `withPolkadotSdkCompat`

## 1.0.1 - 2024-07-18

## Fixed

- Improved intellisense name for default export

## 1.0.0 - 2024-07-18

### Changed

Initial release
