# Changelog

## V2

### Changed

- `Binary` is now a set of utilities for Uint8Array.

### Removed

- `Bin` codec

## Unreleased

## 0.17.0 - 2026-01-22

### Changed

- `UnifiedMetadata` now exposes signedExtensions by `ExtVersion`

## 0.16.6 - 2026-01-05

### Fixed

- Binary: opaque representation

## 0.16.5 - 2025-10-31

### Fixed

- Perf improvement for AccountId decoder

## 0.16.4 - 2025-10-09

### Fixed

- Use `0x${string}` type for `Binary.asHex()`

## 0.16.3 - 2025-09-15

### Fixed

- `ethAccount` correctly encodes valid addresses.

### Added

- Export `Keccak256`

## 0.16.2 - 2025-09-05

### Fixed

- Update dependencies

## 0.16.1 - 2025-09-03

### Fixed

- Update to @noble v2

## 0.16.0 - 2025-08-21

### Added

- Utils for dealing with the `trie`: `trieNodeDec` and `validateProofs`

## 0.15.1 - 2025-07-23

### Fixed

- Add missing `Other` variant to `DigestItem` codec

## 0.15.0 - 2025-07-16

### Added

- `BitSeq` codec-creator with an enhanced input/output data-structure

## 0.14.0 - 2025-05-30

### Added

- Add `ExtrinsicFormat` codec

## 0.13.0 - 2025-05-15

### Added

- Add Metadata V16 codec.
- Add `UnifiedMetadata`.

### Removed

- Unused `V14Extrinsic` and `V15Extrinsic` types.

## 0.12.0 - 2025-04-24

### Added

- Scale higher-order codecs now produce codecs with an `inner` property, so that it's "inner" codecs can be available to the consumer.

## 0.11.1 - 2025-03-07

### Fixed

- Ensure `compactNumber` and `compactBn` always decode to the appropriate type

## 0.11.0 - 2024-12-18

### Changed

- Avoid requiring value decoder for storage

## 0.10.0 - 2024-12-10

### Added

- `getMultisigAccountId` to get the AccountId of a multisig

## 0.9.4 - 2024-11-22

### Fixed

- Handle storage entries that use opaque hashers.

## 0.9.3 - 2024-10-29

### Fixed

- Update dependencies

## 0.9.2 - 2024-10-11

### Added

- New `FixedSizeBinary` static method `fromAccountId32`

## 0.9.1 - 2024-10-05

### Fixed

- Target ES2022 when bundling

## 0.9.0 - 2024-10-03

### Added

- Export the codec of metadata lookup as `v14Lookup`. [#717](https://github.com/polkadot-api/polkadot-api/pull/717)

## 0.8.0 - 2024-09-24

### Added

- Add `decAnyMetadata` method to decode metadata from various formats.

## 0.7.0 - 2024-09-04

### Added

- New `Binary` methods for supporting "`opaque`" binary data. [#675](https://github.com/polkadot-api/polkadot-api/pull/675).

## 0.6.3 - 2024-08-12

### Fixed

- Incorrect bytes to skip when decoding storage key

## 0.6.2 - 2024-07-25

### Fixed

- Update dependencies

## 0.6.1 - 2024-07-18

### Fixed

- Changed build to show individual files on source map explorers [#567](https://github.com/polkadot-api/polkadot-api/pull/567)

## 0.6.0 - 2024-07-03

### Added

- Add `blake3` helper functions
- Re-export `Enum` from `scale-ts` as `ScaleEnum`

## 0.5.0 - 2024-05-10

### Breaking

- Remove descriptor types (moved to client package)

## 0.4.0 - 2024-05-03

### Breaking

- Move the `is` and `as` methods from enum values to `Enum`: `Enum.is(value, tag)`, `Enum.as(value, tag)`.

## 0.3.0 - 2024-04-25

### Added

- New type `EnumVariant<T, K>` to select one specific variant from an enum.
- Improved Enum type inference so that they can be assigned between types as long as they are compatible.

### Breaking

- The generic for `Enum<T>` is now an object of `{ [type: string]: any }`, rather than a union of `{ type: string, value: any } | ... | { type: string, value: any }`

## 0.2.0 - 2024-04-23

### Added

- Support for metadata V14

## 0.1.0 - 2024-04-22

### Changed

- Added support for `AccountId20`

## 0.0.1 - 2024-04-03

### Changed

Initial release
