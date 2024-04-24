# Changelog

## Unreleased

### Breaking

- Remove discriminant utilities (`is`, `as`) from `Enum`s. They have been moved to the `Enum(type, value)` function:
  - `myEnum.is('V2')` becomes `Enum.is(myEnum, 'V2')`
  - `myEnum.as('V2')` becomes `Enum.as(myEnum, 'V2')`
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
