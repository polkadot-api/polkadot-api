# Changelog

## Unreleased

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
