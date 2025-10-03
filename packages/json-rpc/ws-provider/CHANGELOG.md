# Changelog

## Unreleased

### Fixed

- Sometimes WebSocket connections become stale without triggering a "close" event. The only way to detec that
  is through either the `ping/pong` control frame events, or by reacting when it's been too long without receiving
  a notification from the server. This release applies a heartbeat strategy which prevents connections from becoming stale.

### Added

- `heartbeatTimeout` option to control how long to wait without having received notifications from the server beforeswitching
  switching connections. It defaults to 40 secs.

## 0.6.2 - 2025-10-03

### Fixed

- Ensure that it attempts to switch endpoints when it finds a faulty RPC that's constantly emitting `stop` events (2nd attempt)
- Propagate `innerEnhancer` disconnection

## 0.6.1 - 2025-09-29

### Fixed

- Typescript import when moduleResolution = node
- Ensure that it attempts to switch endpoints when it finds a faulty RPC that's constantly emitting `stop` events

## 0.6.0 - 2025-09-18

### Added

- New default export with an improved API. The `/web` and `/node` sub-path exports should be considered deprecated.
  The new export only has one overload: The first argument are the endpoitns, and the second argument is the config which now accepts a custom `WebSockecClass`.

## 0.5.0 - 2025-08-11

### Added

- `innerEnhancer` option: allows to provide an enhancer that will be applied at the lowest possible level, before any of the internal enhancers of the ws-provider are applied.

## 0.4.1 - 2025-07-16

### Fixed

- Update dependencies

## 0.4.0 - 2025-02-26

### Added

- It switches endpoint/reconnects if the current endpoint doesn't support the critical methods.

## 0.3.6 - 2024-11-18

### Fixed

- `followEnhancer` should resend the errored chainHead_v1_follow request.

## 0.3.5 - 2024-11-15

### Fixed

- Added an internal `followEnhancer` to address issues with certain RPC providers where misconfigured middlewares incorrectly trigger errors on `chainHead_v1_follow` requests, even though the client hasn't reached the 2-subscription limit.

## 0.3.4 - 2024-10-31

### Added

- New interface `WsProviderConfig` and and overload which accepts this interface. This config interface allows to setup the desired timeout time at which the WebSocket should retry the connection.

### Fixed

- Close socket connection when internal timeout is reached to prevent race-conditions.
- Close socket connection when switching connections before the previous connection has been established.

## 0.3.3 - 2024-10-31

- Accidental release (please don't use it)

## 0.3.2 - 2024-10-11

### Fixed

- Export missing types

## 0.3.1 - 2024-10-05

### Fixed

- Target ES2022 when bundling

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
