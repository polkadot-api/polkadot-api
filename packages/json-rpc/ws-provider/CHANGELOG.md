# Changelog

## Unreleased

### Fixed

- Update dependencies

## 0.3.0 - 2024-10-03

### Added

- Introduced support for multiple endpoints. The client now rotates between provided endpoints in case of connection issues.
- Added two options for introspection on protocol status:
  - Pass a `statusChange` callback when creating the client to receive updates on the connection status.
  - Call the `getStatus` function on the `WsJsonRpcProvider` to retrieve the current status of the protocol layer.

### Changed

- The client can now proactively trigger a switch to a different endpoint, giving users more control over which endpoint to use.

### Fixed

- Automatic timeout handling: the client will now timeout if the connection to the RPC doesn't open in a timely manner and will attempt to reconnect with the next available RPC endpoint.

## 0.2.2 - 2024-09-20

### Fixed

- Improve logs when there is a transport close/error

## 0.2.1 - 2024-09-19

### Fixed

- Some logs when there is a transport close/error

## 0.2.0 - 2024-08-12

### Changed

- Renamed `WebSocketProvider` => `getWsProvider`

### Fixed

- Fixed correct ESM export for React Native.

## 0.1.1 - 2024-07-18

### Fixed

- Changed build to show individual files on source map explorers [#567](https://github.com/polkadot-api/polkadot-api/pull/567)
- patch dependencies

## 0.1.0 - 2024-05-03

### Fixed

- patch dependencies

## 0.0.1 - 2024-04-03

### Changed

Initial release
