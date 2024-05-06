# Changelog

## Unreleased

### Fixed

- ensure `bestBlocks$` always start with latest known `finalizedBlock` [#491](https://github.com/polkadot-api/polkadot-api/pull/491)
- Stop-recovery: blocks from previous session getting unpinned
- `operationLimit`-recovery: properly recover from `operationLimit` responses [#494](https://github.com/polkadot-api/polkadot-api/pull/494)
  Closes [#492](https://github.com/polkadot-api/polkadot-api/issues/492)
- Recover from stop events when runtime hasn't loaded and finalized block changes

## 0.2.2 - 2024-05-03

### Fixed

- update dependencies

## 0.2.1 - 2024-04-25

### Fixed

- fixed: compatibility enhancer

## 0.2.0 - 2024-04-23

### Added

- Support for metadata V14

## 0.1.1 - 2024-04-12

### Fixed

- [Tx with competing forks problem](https://github.com/polkadot-api/polkadot-api/pull/415)

## 0.1.0 - 2024-04-09

### Changed

- Improved the `bestBlocks$` observable API. For the sake of consistency, the first block of the list will always be the best-block, and the last item of the list will always be the finalized-block. When the best-block and the finalized-block are the same, then the list will contain just one item. Therefore, the observable will never emit an emtpy list.

### Fixed

- The first block on the `finalizedBlockHashes` list of the `initialized` event was not referencing its correct parent when the list had more than one item.
- Added temporary workaround while https://github.com/paritytech/polkadot-sdk/issues/3658 is being fixed

## 0.0.1 - 2024-04-03

### Changed

Initial release
