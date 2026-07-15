# Changelog

## Unreleased

## 0.4.0 - 2026-07-15

### Changed

- Allow `getPjsTxHelper` to support custom extensions.

## 0.3.4 - 2026-07-07

### Fixed

- Immortal transactions were signed with the era bytes (`0x00`) as the `CheckMortality` checkpoint instead of the genesis hash, producing invalid signatures for every immortal pjs payload.

## 0.3.1 to 0.3.3 - 2026-05-19

### Fixed

- Update dependencies

## 0.3.0 - 2026-04-07

### Changed

- Drop support for CommonJS

## 0.2.5 - 2026-03-13

### Fixed

- Wrong type on `DecodedExtrinsic.call`

## 0.2.1 to 0.2.4 - 2026-02-19

### Fixed

- Update dependencies

## 0.2.0 - 2025-11-27

### Added

- New `getTxHelper` API

## 0.1.1 to 0.1.8 - 2025-10-31

### Fixed

- Update dependencies

## 0.1.0 - 2025-05-30

### Changed

- Refactor `decodeExtrinsic` to include Extrinsic V5

## 0.0.6 to 0.0.13 - 2025-05-20

### Fixed

- Update dependencies

## 0.0.5 - 2024-11-20

### Fixed

- Account for `CheckTxVersion`

## 0.0.3 to 0.0.4 - 2024-10-29

### Fixed

- Update dependencies

## 0.0.2 - 2024-10-11

### Fixed

- Fully support metadata v14 for extrinsic decoding

## 0.0.1 - 2024-10-07

### Changed

Initial release
