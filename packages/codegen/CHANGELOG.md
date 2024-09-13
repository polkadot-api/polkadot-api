# Changelog

## Unreleased

### Fixed

- Reduced startup memory usage due to esbuild issue [#711](https://github.com/polkadot-api/polkadot-api/pull/711)

## 0.11.0 - 2024-09-10

### Fixed

- Resolve errors with a fine-grained approach in the whitelist

### Removed

- Remove errors from generated descriptors code

## 0.10.0 - 2024-09-04

### Changed

- Replace chain call data types for broader `TxCallData` [#687](https://github.com/polkadot-api/polkadot-api/pull/687).

## 0.9.0 - 2024-08-28

### Changed

- Updated known-types to match new checksums [#667](https://github.com/polkadot-api/polkadot-api/pull/667)

## 0.8.0 - 2024-08-12

### Added

- Export chain DispatchError on descriptors file [#615](https://github.com/polkadot-api/polkadot-api/pull/615).

### Fixed

- Descriptors entry points when transaction and events have the same checksum.

## 0.7.2 - 2024-07-25

### Fixed

- Whitelist entry for runtime apis

## 0.7.1 - 2024-07-19

### Fixed

- Whitelist entry for pallet wildcard

## 0.7.0 - 2024-07-18

### Breaking

- Generate metadata types instead of checksums [#561](https://github.com/polkadot-api/polkadot-api/pull/561)

### Fixed

- Changed build to show individual files on source map explorers [#567](https://github.com/polkadot-api/polkadot-api/pull/567)

## 0.6.2 - 2024-07-11

### Fixed

- Update dependencies

## 0.6.1 - 2024-07-03

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
