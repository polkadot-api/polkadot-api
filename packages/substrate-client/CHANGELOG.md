# Changelog

## Unreleased

### Fixed

- Remove annoying console warnings.

## 0.4.6 - 2025-09-05

### Fixed

- Update dependencies

## 0.4.5 - 2025-09-03

### Fixed

- Remove unnecessary cache

## 0.4.4 - 2025-08-11

### Fixed

- Avoid runtime error when the reply to `transaction_v1_broadcast` comes synchronously.

## 0.4.3 - 2025-08-08

### Fixed

- Update dependencies

## 0.4.2 - 2025-08-07

### Fixed

- Avoid runtime error when the reply to `chainHead_v1_follow` comes synchronously (plus other nits and fixes).

## 0.4.1 - 2025-06-16

### Fixed

- Improve error handling for JSON-RPC replies with a `null` `id`

## 0.4.0 - 2025-05-30

### Added

- Support for `archive_v1`

## 0.3.0 - 2024-11-05

### Changed

- `createClient` will return the same client instance if called multiple times with the same provider (referential equality).

## 0.2.2 - 2024-10-05

### Fixed

- Target ES2022 when bundling

## 0.2.1 - 2024-08-12

### Fixed

- Circular dependecy between chainHead and storage

## 0.2.0 - 2024-07-18

### Breaking

- The client is now only compliant with the standard [JSON-RRC spec](https://paritytech.github.io/json-rpc-interface-spec/). Its consumers can use middlewares (like `@polkadot-api/polkadot-sdk-compat`) to translate non spec-compliant endpoints to a compliant one.

### Fixed

- Changed build to show individual files on source map explorers [#567](https://github.com/polkadot-api/polkadot-api/pull/567)

## 0.1.4 - 2024-07-03

### Fixed

- Export JSON-RPC Provider types and AbortError

## 0.1.3 - 2024-06-19

### Fixed

- Add `@polkadot-api/utils` as `dependecy`.

## 0.1.2 - 2024-05-10

### Fixed

- fixed: improve the cancelation logic on operations that have not yet received its operationId [#484](https://github.com/polkadot-api/polkadot-api/pull/484)

## 0.1.1 - 2024-04-25

### Fixed

- fixed: compatibility enhancer

## 0.1.0 - 2024-04-25

### Added

- `getChainSpecData: () => Promise<{name: string, genesisHash: string, properties: any}>`.

### Fixed

- Improve the compatibility handling with the different versions of the JSON-RPC methods.

## 0.0.2 - 2024-04-20

### Fixed

- `operationWaitingForContinue` response was missing the `operationId`

## 0.0.1 - 2024-04-03

### Changed

Initial release
