# Changelog

## Unreleased

## 0.6.4 - 2024-12-10

### Fixed

- Update dependencies

## 0.6.3 - 2024-11-22

### Fixed

- "Fix" `storageQueries` to account for https://github.com/paritytech/polkadot-sdk/issues/6683
- Update dependencies

## 0.6.2 - 2024-11-07

### Fixed

- Make `follow$` a connectable observable.

## 0.6.1 - 2024-11-05

### Fixed

- Fix caching issue on destroy

## 0.6.0 - 2024-11-05

### Changed

- `getObservableClient` will return the same client instance if called multiple times with the same substrate client.
- Allow multiple subscribers on the same `chainHead` subscription.

## 0.5.14 - 2024-10-29

### Fixed

- Update dependencies

## 0.5.13 - 2024-10-24

### Fixed

- Add types of topics for SystemEvent
- Problem with race-conditions on cached streams

## 0.5.12 - 2024-10-24

### Fixed

- Update dependencies

## 0.5.11 - 2024-10-18

### Fixed

- Improve logic of `withOptionalHash` for non-static blocks.

## 0.5.10 - 2024-10-16

### Fixed

- Properly decode metadata v14 for chains that don't support metadata v15

## 0.5.9 - 2024-10-11

### Fixed

- Update dependencies

## 0.5.8 - 2024-10-05

### Fixed

- Target ES2022 when bundling

## 0.5.7 - 2024-10-03

### Fixed

- Update dependencies

## 0.5.6 - 2024-09-24

### Fixed

- Update dependencies

## 0.5.5 - 2024-09-20

### Fixed

- Remove logic that belongs into the PolkadotSDK Compat Enhancers

## 0.5.4 - 2024-09-20

### Fixed

- Handle non-spec-compliant pruned-blocks.
- Fix small mem-leak when deleting prunned-blocks

## 0.5.3 - 2024-09-04

### Fixed

- Uncaught exception when closing ObservableClient while loading runtime

## 0.5.2 - 2024-08-28

### Fixed

- Update and remove unused dependencies

## 0.5.1 - 2024-08-12

### Fixed

- Update dependencies

## 0.5.0 - 2024-07-25

### Added

- `InvalidTxError`: a new Error with all the information needed to determine what
  was the reason why the transaction is invlid. Its typings can be obtained via the `TransactionValidityError` type [#589](https://github.com/polkadot-api/polkadot-api/pull/589).

## 0.4.0 - 2024-07-18

### Breaking

- Removes `checksumBuilder` from `RuntimeContext`. To migrate, create a new `checksumBuilder` with `getChecksumBuilder(RuntimeContext.lookup)` from metadata-builders.
- Replaces `asset` for `assetId` in `RuntimeContext`. To migrate, use `assetId` to generate the codec and checksum through metadata-builders.
- Removes `metadata` from `RuntimeContext`. It's now available under `RuntimeContext.lookup.metadata`

### Added

- Add `lookup` to `RuntimeContext`, which is the lookup function with the metadata that it was created from.

### Fixed

- Changed build to show individual files on source map explorers [#567](https://github.com/polkadot-api/polkadot-api/pull/567)

## 0.3.2 - 2024-07-11

### Fixed

- Fix caching bug [#556](https://github.com/polkadot-api/polkadot-api/pull/556)

## 0.3.1 - 2024-07-03

### Fixed

- Declare `@polkadot-api/substrate-client` as a peer-dependency

## 0.3.0 - 2024-05-10

### Changed

- `trackTx`: has a more granular and useful API
- expose `isBestOrFinalizedBlock` helper
- expose `pinnedBlocks$`

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
