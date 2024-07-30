# Changelog

## Unreleased

## 0.7.1 - 2024-07-30

### Fixed

- Yarn berry immutable installation from a clean install [#598](https://github.com/polkadot-api/polkadot-api/pull/598).
- Package manager detection with monorepo/workspace projects [#604](https://github.com/polkadot-api/polkadot-api/pull/604).
- `papi update` runs codegen two times when called [#602](https://github.com/polkadot-api/polkadot-api/pull/602).

## 0.7.0 - 2024-07-25

### Changed

- Commands `add`, `remove` and `update` run codegen by default after finishing [#577](https://github.com/polkadot-api/polkadot-api/pull/577).
- Move descriptors package out from `node_modules` [#587](https://github.com/polkadot-api/polkadot-api/pull/587).

### Removed

- Remove `key` argument from `generate` [#577](https://github.com/polkadot-api/polkadot-api/pull/577).

### Fixed

- Whitelist entry for pallet wildcard

## 0.6.1 - 2024-07-18

### Fixed

- Update dependencies

## 0.6.0 - 2024-07-18

### Fixed

- Allow using `add -c` for parachain chainSpecs of well-known relay-chains [#568](https://github.com/polkadot-api/polkadot-api/pull/568)
- Use `@polkadot-api/polkadot-sdk-compat` with WS connections

### Breaking

- Generate metadata types instead of checksums [#561](https://github.com/polkadot-api/polkadot-api/pull/561)

## 0.5.2 - 2024-07-11

### Fixed

- Fixed exception when adding chains from some WASM runtimes
- Update dependencies

## 0.5.1 - 2024-07-03

### Fixed

- Remove redundant checksums [#547](https://github.com/polkadot-api/polkadot-api/pull/547)
- Update dependencies

## 0.5.0 - 2024-05-30

### Added

- Add support to add chain using runtime WASM [#517](https://github.com/polkadot-api/polkadot-api/pull/517)
- Add all known-chains from `@polkadot-api/known-chains` to the `-n` option [#518](https://github.com/polkadot-api/polkadot-api/pull/518)

### Fixed

- Fix high memory usage when running update with multiple chains [#518](https://github.com/polkadot-api/polkadot-api/pull/518)

## 0.4.1 - 2024-05-11

### Fixed

- Update metadata files in parallel and perform a single `generate` afterwords.

## 0.4.0 - 2024-05-10

### Added

- Generate descriptor values into a separate file.
- Generate descriptors if `papi update` is executed.

## 0.3.3 - 2024-05-03

### Fixed

- patch codegen

## 0.3.2 - 2024-04-25

### Fixed

- fixed: compatibility enhancer

## 0.3.1 - 2024-04-25

### Fixed

- Upgraded to `smoldot@2.0.24`

## 0.3.0 - 2024-04-23

### Added

- Specify a whitelist file through `generate --whitelist filename` command.
- Support for metadata V14

## 0.2.2 - 2024-04-11

### Fixed

- Remove the descriptors folder if it exists before attempting to create it.

## 0.2.1 - 2024-04-11

### Fixed

- Check if the descriptors folder exists before attempting to create the folder.

## 0.2.0 - 2024-04-11

### Changed

- Generated code imports from `polkadot-api` instead of `@polkadot-api/client`

## 0.1.0 - 2024-04-09

### Changed

- CLI can now be imported from another module.
- `generate` cleans the output dir before compiling sources.

### Fixed

- Remove bogus dependency `@polkadot-api/client`

## 0.0.1 - 2024-04-03

### Changed

Initial release
