# Changelog

## Unreleased

## 0.3.3 to 0.3.4 - 2025-10-31

### Fixed

- Update dependencies

## 0.3.2 - 2025-10-03

### Fixed

- Improved logic for dealing with unexpected blocks coming from `chain_subscribeAllHeads`
- Better error handling and cleanup logic.

## 0.3.1 - 2025-09-18

### Fixed

- Support `closestDescendantMerkleValue` storage requests
- Handle possible race-condition with the initial emissions from `chain_subscribeAllHeads`

## 0.3.0 - 2025-09-15

### Changed

- The hasher is now inferred. Therefore, `withLegacy` does not receive any arguments.

## 0.2.3 to 0.2.5 - 2025-09-05

### Fixed

- Update dependencies

## 0.2.2 - 2025-08-17

### Fixed

- Avoid redundant `finalized` event.

## 0.2.1 - 2025-08-14

### Fixed

- `disconnect` logic properly cleans upstream subscriptions and propagates `stop` event downstream.

## 0.2.0 - 2025-08-11

### Changed

Initial release
