# Changelog

## Unreleased

### Fixed

- Avoid BlockNotPinned runtime error caused by the `initialized` event not mutating the `pinnedBlocks` Object.

## 0.13.6 - 2025-08-21

### Fixed

- Fixed small memory leak on new-blocks.
- Fixed an issue that happened sometimes when recovering from a `stop` event, because the first block from the `initialized` event was always deemed as carrying a new runtime with it.
- Make `@polkadot-api/substrate-client` a regular dependency instead of peerDependency.

## 0.13.5 - 2025-08-11

### Fixed

- Update dependencies

## 0.13.4 - 2025-08-07

### Fixed

- Prevent uncaught RPC error on unpin

## 0.13.3 - 2025-08-01

### Fixed

- Increase the runtime usage of the initialized blocks.

## 0.13.2 - 2025-07-23

### Fixed

- Handle `initialized` events that carry finalized-blocks with different runtimes
- Implementation of the `chainHead.holdBlock` function

### Added

- `chainHead.withHodl` operator

## 0.13.1 - 2025-07-16

### Fixed

- Update dependencies

## 0.13.0 - 2025-06-20

### Added

- `RuntimeContext` exposes a new function: `getMortalityFromTx`, which can be used to obtain the mortality date from a tx.

## 0.12.0 - 2025-06-16

### Added

- `archive` functionalities

### Changed

- remove `{raw: HexString, mapped: T}` interface, from chainHead.storage

## 0.11.2 - 2025-06-04

### Fixed

- Throw \`BlockNotPinned\` when trying to access a non-pinned block.

## 0.11.1 - 2025-05-30

### Fixed

- Update dependencies

## 0.11.0 - 2025-05-21

### Added

- Mechanisms to safely cache the metadata, by using the hash of the `:code` as its key.

## 0.10.2 - 2025-05-20

### Fixed

- Update dependencies

## 0.10.1 - 2025-05-18

### Fixed

- `concatMapEager()` completing if the first inner observable emits synchronously.

## 0.10.0 - 2025-05-15

### Changed

- Prefer metadata V16 when creating the client.

## 0.9.1 - 2025-05-05

### Fixed

- Avoid race-conditions when destroying the client.

## 0.9.0 - 2025-04-24

### Added

- `chainHead.newBlocks$` to receive all the blocks discovered by the client.

### Changed

- chainHead will not throw when using non-best or non-finalized chain blocks

### Removed

- `NotBestBlockError`
- `BlockPrunedError`
- `unpinned` property from `pinnedBlocks`

## 0.8.6 - 2025-04-10

### Fixed

- missing chainHead subscription error after a stop event with operations in operation limit queue

## 0.8.5 - 2025-03-21

### Fixed

- metadata not updating after a runtime upgrade

## 0.8.4 - 2025-03-21

### Fixed

- prevent the unpinning of blocks from the previous follow subscription after recovering from a `stop` event.

## 0.8.3 - 2025-03-20

### Fixed

- chainHead not recovering after RPC error.
- finalized emits blocks that are not pinned after a stop event recovery.
- cached streams persisting after stop event recovery.

## 0.8.2 - 2025-03-07

### Fixed

- Update dependencies

## 0.8.1 - 2025-02-26

### Fixed

- Avoid gaps on `finalizedBlock$` [#943](https://github.com/polkadot-api/polkadot-api/pull/943).

## 0.8.0 - 2025-02-06

### Added

- ChainHead exposes a `genesisHash$` Observable

## 0.7.2 - 2025-01-24

### Fixed

- Update dependencies

## 0.7.1 - 2025-01-23

### Fixed

- Add block hash and operation for BlockNotPinned error.

## 0.7.0 - 2024-12-18

### Added

- expose `isBestOrFinalizedBlock` helper

## 0.6.5 - 2024-12-17

### Fixed

- fix `concatMapEager`

### Changed

- `chainHead.storage$` also returns the StorageResult when there is a mapper
- export `concatMapEager`

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
