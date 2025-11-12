# Changelog

## Unreleased

## 0.2.7 - 2025-11-12

### Fixed

- Allow the consumer to call `onHalt` multiple times during its teardown logic.

## 0.2.6 - 2025-11-11

### Fixed

- Handle re-entry issue on synchronous `onHalt` (and improve retry waiting time).

## 0.2.5 - 2025-10-09

### Fixed

- Make transaction methods resilient to reconnections

## 0.2.4 - 2024-10-18

### Fixed

- Properly handle errored requests.

## 0.2.3 - 2024-10-05

### Fixed

- Avoid using `Map.values().forEach()`
- Target ES2022 when bundling

## 0.2.2 - 2024-10-03

### Fixed

- Rewrite the internals and better support when dealing wiht halted on-going requests

## 0.2.1 - 2024-09-19

### Fixed

- Added a property to identify internal "stop" events.

## 0.2.0 - 2024-07-18

### Fixed

- Changed build to show individual files on source map explorers [#567](https://github.com/polkadot-api/polkadot-api/pull/567)

### Breaking

- Remove support for `transactionWatch`

## 0.1.0 - 2024-05-03

### Fixed

- Ensure that the proxy works with all the known versions of the JSON-RPC spec

## 0.0.1 - 2024-04-03

### Changed

Initial release
