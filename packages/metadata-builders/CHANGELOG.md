# Changelog

## Unreleased

### Fixed

- Storage entry values decode to `null` if the entry is void.

## 0.12.0 - 2025-05-15

### Added

- Add `viewFns` checksum and dynamic builder capabilities.

### Changed

- `getLookupFn` takes a `UnifiedMetadata`, instead of `V14 | V15`.

## 0.11.0 - 2025-04-24

### Added

- `buildStorage` on the dynamic-builder now also returns an `args` property, which is simply the Tuple codec of the args.

## 0.10.2 - 2025-03-07

### Fixed

- Update dependencies

## 0.10.1 - 2025-01-24

### Fixed

- checksumBuilder: fix infinite loop with self-referencing individual nodes.

## 0.10.0 - 2024-12-18

### Changed

- Expose whole `keys` and `value` codecs for storage

## 0.9.3 - 2024-12-10

### Fixed

- Update dependencies

## 0.9.2 - 2024-11-22

### Fixed

- Update dependencies

## 0.9.1 - 2024-10-29

### Fixed

- Update dependencies

## 0.9.0 - 2024-10-24

### Added

- Expose inner type of compacts.

## 0.8.2 - 2024-10-11

### Fixed

- Update dependencies

## 0.8.1 - 2024-10-05

### Changed

- `Compact<void>` is now resolved as `void` in lookup level
- Target ES2022 when bundling

## 0.8.0 - 2024-10-03

### Added

- Export `denormalizeLookup` function to denormalize metadata types. [#717](https://github.com/polkadot-api/polkadot-api/pull/717)
- Export `getLookupCodecBuilder` function to create the codec of a specific lookup type. [#717](https://github.com/polkadot-api/polkadot-api/pull/717)

## 0.7.1 - 2024-09-24

### Fixed

- Update dependencies

## 0.7.0 - 2024-09-04

### Added

- lookup: Add `call` parameter to lookup with the id of the `outerEnums.call` (also for v14) [#687](https://github.com/polkadot-api/polkadot-api/pull/687).

## 0.6.0 - 2024-08-28

### Changed

- checksum: fixed-size array of len=1 should match the inner type [#667](https://github.com/polkadot-api/polkadot-api/pull/667)

## 0.5.0 - 2024-08-12

### Changed

- lookup: Replace opaque metadata ModuleError for an enum of all the errors [#615](https://github.com/polkadot-api/polkadot-api/pull/615).

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
