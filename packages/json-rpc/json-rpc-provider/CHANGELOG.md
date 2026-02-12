# Changelog

## Unreleased

## 0.1.0 - 2026-02-12

### Changed

- BREAKING: `JsonRpcProvider` interface uses fully typed and parsed messages, rather than using `string`s.

### Added

- New interfaces: `JsonRpcId`, `JsonRpcRequest`, `JsonRpcError`, `JsonRpcResponse` and `JsonRpcMessage`
- New helper functions: `isRequest` and `isResponse`, useful for narrowing downn the types of a `JsonRpcMessage`.

## 0.0.4 - 2024-10-05

### Fixed

- Target ES2022 when bundling

## 0.0.3 - 2024-08-12

### Fixed

- Don't export empty chunks when building

## 0.0.2 - 2024-07-18

### Fixed

- Changed build to show individual files on source map explorers [#567](https://github.com/polkadot-api/polkadot-api/pull/567)

## 0.0.1 - 2024-04-03

### Changed

Initial release
