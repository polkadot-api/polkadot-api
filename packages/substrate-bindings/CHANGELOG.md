# Changelog

## Unreleased

### Breaking

- Separate `Enum` from `OutputEnum`
  - `Enum<T>` is only `{ type: string, value: any }` without the discriminants `as`, `is`.
  - `OutputEnum<Enum<T>>` is `Enum<T> & Discriminant<Enum<T>>` (with `as`, `is` functions)
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
