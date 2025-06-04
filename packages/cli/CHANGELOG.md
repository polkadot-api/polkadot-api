# Changelog

## Unreleased

## 0.13.4 - 2025-06-04

### Fixed

- Update dependencies

## 0.13.3 - 2025-05-30

### Fixed

- Update dependencies

## 0.13.2 - 2025-05-27

### Fixed

- Update dependencies

## 0.13.1 - 2025-05-27

### Fixed

- Update dependencies

## 0.13.0 - 2025-05-21

### Added

- Store the "code-hash" linked to each metadata, so that it can be safely cached.

## 0.12.2 - 2025-05-20

### Fixed

- Update dependencies

## 0.12.1 - 2025-05-18

### Fixed

- Update dependencies

## 0.12.0 - 2025-05-15

### Added

- Expose `<key>Apis` type for Runtime APIs.

### Fixed

- Ensure final newline is added on all files
- Fix entry docs not getting stripped properly [#1033](https://github.com/polkadot-api/polkadot-api/issues/1033).

## 0.11.13 - 2025-05-05

### Fixed

- Avoid throwing if there are no chains to generate.

## 0.11.12 - 2025-05-04

### Fixed

- Pin ES target version for descriptors.

## 0.11.11 - 2025-04-24

### Fixed

- Update dependencies

## 0.11.10 - 2025-04-16

### Fixed

- generate: Nested enums show up as AnonymousEnum

## 0.11.9 - 2025-04-16

### Fixed

- generate: Inline single-use types to avoid circular TSC errors.

## 0.11.8 - 2025-04-14

### Fixed

- Support new `bun.lock` lockfile
- Update dependencies

## 0.11.7 - 2025-04-10

### Fixed

- Update dependencies

## 0.11.6 - 2025-04-01

### Fixed

- Update dependencies

## 0.11.5 - 2025-04-01

### Fixed

- Add from wasm gets stuck with "Writing metadata"

## 0.11.4 - 2025-03-21

### Fixed

- Update dependencies

## 0.11.3 - 2025-03-20

### Fixed

- Update dependencies

## 0.11.2 - 2025-03-07

### Fixed

- Update dependencies

## 0.11.1 - 2025-02-26

### Fixed

- Update dependencies.

## 0.11.0 - 2025-02-06

### Added

- `getMetadata` in descriptors
- Store genesis-hash whenever possible

### Fixed

- Update dependencies.

## 0.10.3 - 2025-01-24

### Fixed

- Fix crash when generating code for some chains.

## 0.10.2 - 2025-01-23

### Fixed

- Update dependencies.

## 0.10.1 - 2025-01-13

### Fixed

- Whitelist should be a common option

## 0.10.0 - 2024-12-18

### Added

- Add CLI version command
- Option flag `noDescriptorsPackage: boolean` to generate descriptors without installing them as a package.

### Changed

- Require `version` at `getCli`

## 0.9.23 - 2024-12-17

### Fixed

- Update dependencies

## 0.9.22 - 2024-12-10

### Fixed

- Update dependencies

## 0.9.21 - 2024-11-22

### Fixed

- Update dependencies

## 0.9.20 - 2024-11-19

### Fixed

- Update dependencies

## 0.9.19 - 2024-11-18

### Fixed

- Update dependencies

## 0.9.18 - 2024-11-15

### Fixed

- Update dependencies

## 0.9.17 - 2024-11-07

- Patch dependencies (smoldot)

## 0.9.16 - 2024-11-07

### Fixed

- Patch `@polkadot-api/observable-client` connectable bug
- Update dependencies (smoldot-patched)

## 0.9.15 - 2024-11-06

### Fixed

- Patch `@polkadot-api/observable-client` bug

## 0.9.14 - 2024-11-05

### Fixed

- Update dependencies

## 0.9.13 - 2024-10-29

### Fixed

- Update dependencies

## 0.9.12 - 2024-10-24

### Fixed

- Update dependencies

## 0.9.11 - 2024-10-24

### Fixed

- Update dependencies

## 0.9.10 - 2024-10-18

### Fixed

- Fix unable to run codegen on windows

## 0.9.9 - 2024-10-16

### Fixed

- Update dependencies

## 0.9.8 - 2024-10-16

### Fixed

- Update dependencies

## 0.9.7 - 2024-10-12

### Fixed

- Missing dependency `@polkadot-api/ink-contracts`

## 0.9.6 - 2024-10-11

- Update dependencies

## 0.9.5 - 2024-10-05

### Fixed

- Target ES2022 when bundling

## 0.9.4 - 2024-10-03

### Fixed

- Update dependencies

## 0.9.3 - 2024-09-24

### Fixed

- Update dependencies

## 0.9.2 - 2024-09-20

### Fixed

- Update dependencies

## 0.9.1 - 2024-09-20

### Fixed

- Update dependencies

## 0.9.0 - 2024-09-19

### Added

- Exported getMetadata and readPapiConfig, to use in @polkadot-api/docgen

### Fixed

- Reduced startup memory usage due to esbuild issue [#711](https://github.com/polkadot-api/polkadot-api/pull/711)

## 0.8.2 - 2024-09-10

### Fixed

- Update dependencies

## 0.8.1 - 2024-09-04

### Fixed

- Update dependencies.

## 0.8.0 - 2024-08-28

### Changed

- Updated checksums of known-types [#667](https://github.com/polkadot-api/polkadot-api/pull/667)
- Remove unused dependencies

## 0.7.6 - 2024-08-26

### Fixed

- Remove cli warning when generating descriptors.
- Flush vite dependency cache after generating descriptors.

## 0.7.5 - 2024-08-16

### Fixed

- Update dependencies

## 0.7.4 - 2024-08-12

### Fixed

- Unable to fetch metadata from parachains.

## 0.7.3 - 2024-08-12

### Fixed

- Update dependencies

## 0.7.2 - 2024-08-12

### Fixed

- Descriptors entry points when transaction and events have the same checksum.
- Update provider dependencies
- Update dependencies

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
