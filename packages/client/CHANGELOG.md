# Changelog

## Unreleased

### Changed

- Moved `getObservableClient` and all derived types into a separate `@polkadot-api/observable-client` package.
- Added and exported missing types for transactions: (`TxBroadcastEvent`, `TxEvent`, `TxFinalizedPayload`)
- Improved the `bestBlocks$` observable API. For the sake of consistency, the first block of the list will always be the best-block, and the last item of the list will always be the finalized-block. When the best-block and the finalized-block are the same, then the list will contain just one item. Therefore, the observable will never emit an emtpy list.

### Fixed

- `watchValue` is no longer missing updates.

## 0.0.1 - 2024-04-03

### Changed

Initial release
