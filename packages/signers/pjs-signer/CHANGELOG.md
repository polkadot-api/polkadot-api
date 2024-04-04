# Changelog

## Unreleased

### Changed

- `getInjectedExtensions` is now a synchronous function which returns
  `null` when the `window.injectedWeb3` property is not present, or a list of
  keys representing the names of the injected extensions.

### Added

- New `InjectedExtension` interface. It used to be an anonymous type.

## 0.0.1 - 2024-04-03

### Changed

Initial release
