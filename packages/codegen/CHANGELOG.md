# Changelog

## Unreleased

### Fixed

- Remove redundant checksums [#547](https://github.com/polkadot-api/polkadot-api/pull/547)

## 0.6.0 - 2024-05-30

### Changed

- Compact the data when generating descriptor from multiple chains [#516](https://github.com/polkadot-api/polkadot-api/pull/516)

## 0.5.0 - 2024-05-10

### Breaking

- Decouple descriptor types from descriptor values
- Lazy load descriptor values

## 0.4.0 - 2024-05-03

### Breaking

- [Deduplicate equivalent known types](https://github.com/polkadot-api/polkadot-api/pull/448)

### Fixed

- `Anonymize` is now able to properly distinguish `Binary` types,
  which were previously being anonymized as `FixedSizeBinary<number>`

## 0.3.0 - 2024-04-25

### Breaking

- The generic for `Enum<T>` is now an object of `{ [type: string]: any }`, rather than a union of `{ type: string, value: any } | ... | { type: string, value: any }`

## 0.2.0 - 2024-04-23

### Added

- Support for metadata V14

## 0.1.0 - 2024-04-22

### Added

- Descriptor files now includes a `WhitelistEntry` type to build whitelists.

- Added support for `AccountId20`

## 0.0.2 - 2024-04-11

### Fixed

- Generate struct types with property names that have special symbols.

## 0.0.1 - 2024-04-03

### Changed

Initial release
