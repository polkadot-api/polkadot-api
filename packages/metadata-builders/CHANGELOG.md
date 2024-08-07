# Changelog

## Unreleased

### Fixed

- Checksum collision between transaction calls and events.

## 0.4.1 - 2024-07-25

### Fixed

- Update dependencies

## 0.4.0 - 2024-07-18

### Breaking

- `getChecksumBuilder` and `getDynamicBuilder` now take `(lookupFn: MetadataLookup)` as argument instead of just the metadata.

### Fixed

- Changed build to show individual files on source map explorers [#567](https://github.com/polkadot-api/polkadot-api/pull/567)

## 0.3.2 - 2024-07-11

### Fixed

- use `bigCompact` when required on `dynamic-builder`
- remove possibly bogus `void`s from `struct`/`tuple`/`array`

## 0.3.1 - 2024-07-03

### Fixed

- update dependencies

## 0.3.0 - 2024-05-03

### Breaking

- lookup: Normalize `Enum.Variant([T,T,T,T])` into `Enum.Variant([4;T])`
- checksum-builder: Detect mirror types, make them have equivalent checksums

## 0.2.0 - 2024-04-23

### Added

- Support for metadata V14

## 0.1.0 - 2024-04-22

### Changed

- Added support for `AccountId20`

## 0.0.1 - 2024-04-03

### Changed

Initial release
