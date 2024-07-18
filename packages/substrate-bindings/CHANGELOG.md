# Changelog

## Unreleased

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
