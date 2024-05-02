# Changelog

## Unreleased

### Fixed

- Ensure blockNumber in SignerPayloadJSON

## 0.1.2 - 2024-04-27

### Fixed

- Ignore unsupported account types

## 0.1.1 - 2024-04-26

### Fixed

- [SignerPayloadJSON type mismatch - #499](https://github.com/polkadot-api/polkadot-api/issues/449).

## 0.1.0 - 2024-04-05

### Changed

- `getInjectedExtensions` is now a synchronous function which returns
  `null` when the `window.injectedWeb3` property is not present, or a list of
  keys representing the names of the injected extensions.

### Added

- New `InjectedExtension` interface. It used to be an anonymous type.

## 0.0.1 - 2024-04-03

### Changed

Initial release
