# Changelog

## Unreleased

## 0.6.7 - 2025-05-15

### Fixed

- Update dependencies

## 0.6.6 - 2025-04-24

### Fixed

- Update dependencies

## 0.6.5 - 2025-03-07

### Fixed

- Update dependencies

## 0.6.4 - 2025-01-24

### Fixed

- Update dependencies

## 0.6.3 - 2024-12-18

### Fixed

- Update dependencies

## 0.6.2 - 2024-12-10

### Fixed

- Update dependencies

## 0.6.1 - 2024-11-22

### Fixed

- Update dependencies

## 0.6.0 - 2024-11-05

### Added

- Export method `getPolkadotSignerFromPjs`.

## 0.5.2 - 2024-10-29

### Fixed

- Update dependencies

## 0.5.1 - 2024-10-24

### Fixed

- Handle "exotic" extrinsics

## 0.5.0 - 2024-10-16

### Added

- Ability to pass the DApp name to `connectInjectedExtension`.[791](https://github.com/polkadot-api/polkadot-api/pull/791)

## 0.4.5 - 2024-10-11

### Fixed

- Update dependencies

## 0.4.4 - 2024-10-05

### Fixed

- Fix incorrect PJS injected account type
- Target ES2022 when bundling

## 0.4.3 - 2024-09-24

### Fixed

- Use `decAnyMetadata` and accept metadata v14 as well

## 0.4.2 - 2024-09-04

### Fixed

- Remove option byte from `CheckMetadataHash`

## 0.4.1 - 2024-08-28

### Fixed

- Allow creating transactions with `CheckMetadataHash` enabled

## 0.4.0 - 2024-08-12

### Changed

- `getInjectedExtensions` no longer returns `null` and it returns an empty `Array` instead

### Fixed

- Update dependencies

## 0.3.2 - 2024-07-25

### Fixed

- Update dependencies

## 0.3.1 - 2024-07-18

### Fixed

- Changed build to show individual files on source map explorers [#567](https://github.com/polkadot-api/polkadot-api/pull/567)

## 0.3.0 - 2024-07-11

### Changed

- Add API to sign raw-data and rename `sign` to `signTx`

## 0.2.1 - 2024-07-03

### Fixed

- Allow wallet to modify signed payload through [PJS PR](https://github.com/polkadot-js/api/pull/5920) [#551](https://github.com/polkadot-api/polkadot-api/pull/551)

## 0.2.0 - 2024-05-30

### Added

- Add support to `CheckMetadataHash` signed extension [#526](https://github.com/polkadot-api/polkadot-api/pull/526)

## 0.1.4 - 2024-05-10

### Fixed

- Ensure SignerPayloadJSON to be the same as PJS api

## 0.1.3 - 2024-05-03

### Fixed

- Ensure blockNumber in SignerPayloadJSON

## 0.1.2 - 2024-04-27

### Fixed

- Ignore unsupported account types

## 0.1.1 - 2024-04-26

### Fixed

- [SignerPayloadJSON type mismatch - #499](https://github.com/polkadot-api/polkadot-api/issues/449).

## 0.1.0 - 2024-04-05

### Changed

- `getInjectedExtensions` is now a synchronous function which returns
  `null` when the `window.injectedWeb3` property is not present, or a list of
  keys representing the names of the injected extensions.

### Added

- New `InjectedExtension` interface. It used to be an anonymous type.

## 0.0.1 - 2024-04-03

### Changed

Initial release
