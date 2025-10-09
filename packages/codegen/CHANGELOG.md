# Changelog

## Unreleased

## 0.19.2 - 2025-10-09

### Fixed

- Update dependencies

## 0.19.1 - 2025-09-29

### Fixed

- Fix solidity `tuple[]` contract codegen
- Relax solidity `HexString` types

## 0.19.0 - 2025-09-25

### Added

- `generateSolTypes(abi)` to generate contract descriptors from ABI

## 0.18.1 to 0.18.4 - 2025-09-15

### Fixed

- Update dependencies

## 0.18.0 - 2025-08-11

### Added

- Export descriptors type for each chain.

## 0.17.1 - 2025-07-23

### Fixed

- Update dependencies

## 0.17.0 - 2025-07-16

### Changed

- `BitSequence` types are now: `Array<0 | 1>`

## 0.16.1 to 0.16.4 - 2025-06-20

### Fixed

- Update dependencies

## 0.16.0 - 2025-05-20

### Changed

- Now `generateMultipleDescriptors` requires a common file path.

### Fixed

- Storage entry values decode to `null` if the entry is void.

## 0.15.0 - 2025-05-15

### Added

- Add `viewFns` code generation
- Expose `<key>Apis` type for Runtime APIs.

### Fixed

- Fix entry docs not getting stripped properly [#1033](https://github.com/polkadot-api/polkadot-api/issues/1033).

## 0.14.0 - 2025-04-24

### Changed

- ink: add contract attributes to descriptors (default, payable, mutates)

## 0.13.4 - 2025-04-16

### Fixed

- fix nested AnonymousEnum not getting anonymized

## 0.13.3 - 2025-04-16

### Fixed

- Inline single-use types to avoid circular TSC errors.

## 0.13.1 to 0.13.2 - 2025-04-14

### Fixed

- Update dependencies

## 0.13.0 - 2025-02-06

### Added

- `getMetadata` in descriptors
- Store genesis-hash whenever possible
- Add known-types priority discrimination
- Add XCM v5 known types

### Fixed

- Remove unused known types

## 0.12.13 - 2025-01-24

### Fixed

- Fix crash when generating code for some chains.

## 0.12.11 to 0.12.12 - 2024-12-18

### Fixed

- Update dependencies

## 0.12.10 - 2024-11-22

### Fixed

- Fix storage docs generation

## 0.12.9 - 2024-11-22

### Fixed

- Account for storage entries that use opaque hashers.

## 0.12.6 to 0.12.8 - 2024-11-15

### Fixed

- Update dependencies

## 0.12.5 - 2024-10-12

### Fixed

- Missing dependency `@polkadot-api/ink-contracts`

## 0.12.4 - 2024-10-11

### Fixed

- Update dependencies

## 0.12.3 - 2024-10-05

### Fixed

- Target ES2022 when bundling

## 0.12.2 - 2024-10-03

### Fixed

- docgen: array of primitives wasn't reported as arrays.
- Update dependencies

## 0.12.1 - 2024-09-24

### Fixed

- Update dependencies

## 0.12.0 - 2024-09-19

### Added

- Added generation of ts files for docs
- Added tests for types-builder

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
