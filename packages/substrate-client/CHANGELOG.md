# Changelog

## Unreleased

## 0.1.2 - 2024-05-10

### Fixed

- fixed: improve the cancelation logic on operations that have not yet received its operationId [#484](https://github.com/polkadot-api/polkadot-api/pull/484)

## 0.1.1 - 2024-04-25

### Fixed

- fixed: compatibility enhancer

## 0.1.0 - 2024-04-25

### Added

- `getChainSpecData: () => Promise<{name: string, genesisHash: string, properties: any}>`.

### Fixed

- Improve the compatibility handling with the different versions of the JSON-RPC methods.

## 0.0.2 - 2024-04-20

### Fixed

- `operationWaitingForContinue` response was missing the `operationId`

## 0.0.1 - 2024-04-03

### Changed

Initial release
